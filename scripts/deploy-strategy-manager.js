#!/usr/bin/env node

/**
 * Deployment Strategy Manager
 * Orchestrates deployment across multiple platforms with automatic fallback
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

class DeploymentStrategyManager {
  constructor() {
    this.strategies = [
      {
        name: 'Vercel',
        priority: 1,
        deploy: this.deployToVercel.bind(this),
        healthCheck: 'https://jchairstudios62.xyz/api/health',
        configFile: 'vercel.json'
      },
      {
        name: 'Netlify',
        priority: 2,
        deploy: this.deployToNetlify.bind(this),
        healthCheck: 'https://jc-hair-studio.netlify.app/api/health',
        configFile: 'netlify.toml'
      },
      {
        name: 'Railway',
        priority: 3,
        deploy: this.deployToRailway.bind(this),
        healthCheck: null, // Will be set after deployment
        configFile: 'railway.toml'
      },
      {
        name: 'Docker',
        priority: 4,
        deploy: this.deployToDocker.bind(this),
        healthCheck: 'http://localhost:3000/api/health',
        configFile: 'Dockerfile.production'
      }
    ];

    this.currentStrategy = null;
    this.deploymentLog = [];
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    console.log(logEntry);
    this.deploymentLog.push(logEntry);

    // Also write to log file
    const logFile = path.join(process.cwd(), 'deployment.log');
    fs.appendFileSync(logFile, logEntry + '\n');
  }

  async executeCommand(command, description) {
    this.log(`Executing: ${description}`);
    try {
      const result = execSync(command, {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 600000 // 10 minutes timeout
      });
      this.log(`✅ ${description} completed successfully`);
      return { success: true, output: result };
    } catch (error) {
      this.log(`❌ ${description} failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async healthCheck(url, timeout = 30000) {
    if (!url) return false;

    try {
      this.log(`Performing health check: ${url}`);
      const response = await axios.get(url, {
        timeout,
        validateStatus: (status) => status >= 200 && status < 400
      });

      this.log(`✅ Health check passed: ${response.status}`);
      return true;
    } catch (error) {
      this.log(`❌ Health check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async deployToVercel() {
    this.log('🚀 Starting Vercel deployment...');

    // Optimize for Vercel
    const optimizeResult = await this.executeCommand(
      'npm run optimize:build',
      'Build optimization'
    );

    if (!optimizeResult.success) {
      throw new Error('Build optimization failed');
    }

    // Deploy to Vercel
    const deployResult = await this.executeCommand(
      'npx vercel --prod --yes --token $VERCEL_TOKEN',
      'Vercel deployment'
    );

    if (!deployResult.success) {
      throw new Error('Vercel deployment failed');
    }

    // Wait for deployment to be ready
    await new Promise(resolve => setTimeout(resolve, 30000));

    return { success: true, url: 'https://jchairstudios62.xyz' };
  }

  async deployToNetlify() {
    this.log('🚀 Starting Netlify deployment...');

    // Build for Netlify
    const buildResult = await this.executeCommand(
      'npm run build:netlify',
      'Netlify build'
    );

    if (!buildResult.success) {
      throw new Error('Netlify build failed');
    }

    // Deploy to Netlify
    const deployResult = await this.executeCommand(
      'npx netlify deploy --prod --dir=.next --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID',
      'Netlify deployment'
    );

    if (!deployResult.success) {
      throw new Error('Netlify deployment failed');
    }

    return { success: true, url: 'https://jc-hair-studio.netlify.app' };
  }

  async deployToRailway() {
    this.log('🚀 Starting Railway deployment...');

    // Deploy to Railway
    const deployResult = await this.executeCommand(
      'npx railway up --token=$RAILWAY_TOKEN',
      'Railway deployment'
    );

    if (!deployResult.success) {
      throw new Error('Railway deployment failed');
    }

    return { success: true, url: 'https://jc-hair-studio.railway.app' };
  }

  async deployToDocker() {
    this.log('🚀 Starting Docker deployment...');

    // Build Docker image
    const buildResult = await this.executeCommand(
      'docker build -f Dockerfile.production -t jc-hair-studio:latest .',
      'Docker build'
    );

    if (!buildResult.success) {
      throw new Error('Docker build failed');
    }

    // Run Docker container
    const runResult = await this.executeCommand(
      'docker run -d -p 3000:3000 --name jc-hair-studio jc-hair-studio:latest',
      'Docker container start'
    );

    if (!runResult.success) {
      throw new Error('Docker container failed to start');
    }

    return { success: true, url: 'http://localhost:3000' };
  }

  async deployWithStrategy(strategy) {
    this.log(`🎯 Attempting deployment with ${strategy.name}...`);
    this.currentStrategy = strategy;

    try {
      // Check if config file exists
      if (!fs.existsSync(strategy.configFile)) {
        throw new Error(`Configuration file ${strategy.configFile} not found`);
      }

      // Execute deployment
      const result = await strategy.deploy();

      if (!result.success) {
        throw new Error('Deployment execution failed');
      }

      // Perform health check
      if (strategy.healthCheck) {
        const healthOk = await this.healthCheck(strategy.healthCheck);
        if (!healthOk) {
          throw new Error('Health check failed');
        }
      }

      this.log(`✅ ${strategy.name} deployment successful!`);
      return { success: true, strategy: strategy.name, url: result.url };

    } catch (error) {
      this.log(`❌ ${strategy.name} deployment failed: ${error.message}`, 'error');
      return { success: false, strategy: strategy.name, error: error.message };
    }
  }

  async deploy() {
    this.log('🚀 Starting multi-platform deployment strategy...');
    this.log(`Available strategies: ${this.strategies.map(s => s.name).join(', ')}`);

    // Sort strategies by priority
    const sortedStrategies = [...this.strategies].sort((a, b) => a.priority - b.priority);

    for (const strategy of sortedStrategies) {
      const result = await this.deployWithStrategy(strategy);

      if (result.success) {
        this.log(`🎉 Deployment successful with ${result.strategy}!`);
        this.log(`🌐 Application URL: ${result.url}`);

        // Save deployment info
        this.saveDeploymentInfo({
          success: true,
          strategy: result.strategy,
          url: result.url,
          timestamp: new Date().toISOString(),
          log: this.deploymentLog
        });

        return result;
      }

      this.log(`⚠️ ${strategy.name} failed, trying next strategy...`);
    }

    // All strategies failed
    this.log('❌ All deployment strategies failed!', 'error');
    this.saveDeploymentInfo({
      success: false,
      error: 'All deployment strategies failed',
      timestamp: new Date().toISOString(),
      log: this.deploymentLog
    });

    throw new Error('All deployment strategies failed');
  }

  saveDeploymentInfo(info) {
    const deploymentInfoPath = path.join(process.cwd(), 'deployment-info.json');
    fs.writeFileSync(deploymentInfoPath, JSON.stringify(info, null, 2));
    this.log(`📝 Deployment info saved to ${deploymentInfoPath}`);
  }

  async rollback() {
    this.log('🔄 Starting rollback process...');

    if (!this.currentStrategy) {
      this.log('❌ No current deployment to rollback', 'error');
      return;
    }

    try {
      switch (this.currentStrategy.name) {
        case 'Vercel':
          await this.executeCommand('npx vercel rollback --yes', 'Vercel rollback');
          break;
        case 'Docker':
          await this.executeCommand('docker stop jc-hair-studio && docker rm jc-hair-studio', 'Docker rollback');
          break;
        default:
          this.log(`Rollback not implemented for ${this.currentStrategy.name}`);
      }

      this.log('✅ Rollback completed');
    } catch (error) {
      this.log(`❌ Rollback failed: ${error.message}`, 'error');
    }
  }

  getStatus() {
    const deploymentInfoPath = path.join(process.cwd(), 'deployment-info.json');

    if (fs.existsSync(deploymentInfoPath)) {
      const info = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));
      return info;
    }

    return { status: 'No deployment info available' };
  }
}

// CLI Interface
async function main() {
  const manager = new DeploymentStrategyManager();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'deploy':
        await manager.deploy();
        break;
      case 'rollback':
        await manager.rollback();
        break;
      case 'status':
        console.log(JSON.stringify(manager.getStatus(), null, 2));
        break;
      default:
        console.log(`
Usage: node deploy-strategy-manager.js <command>

Commands:
  deploy   - Deploy using multi-platform strategy
  rollback - Rollback current deployment
  status   - Show deployment status

Environment variables required:
  VERCEL_TOKEN         - Vercel deployment token
  NETLIFY_AUTH_TOKEN   - Netlify authentication token
  NETLIFY_SITE_ID      - Netlify site ID
  RAILWAY_TOKEN        - Railway deployment token
        `);
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Deployment manager failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = DeploymentStrategyManager;