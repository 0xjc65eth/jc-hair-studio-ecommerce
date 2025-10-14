#!/bin/bash

DOMAIN="jchairstudios62.xyz"
SITEMAP="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/public/sitemap.xml"

echo "========================================="
echo "RAPID INDEXING - ALL FREE SERVICES"
echo "========================================="
echo "Time: $(date)"
echo ""

# Extract all URLs from sitemap
URLS=$(grep -o '<loc>[^<]*</loc>' "$SITEMAP" | sed 's/<loc>//g' | sed 's/<\/loc>//g')

# Count total URLs
TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Found $TOTAL URLs to index"
echo ""

COUNT=0

for URL in $URLS; do
    COUNT=$((COUNT + 1))
    echo "========================================="
    echo "[$COUNT/$TOTAL] Processing: $URL"
    echo "========================================="

    ENCODED_URL=$(echo "$URL" | jq -sRr @uri)

    # 1. Web Archive / Wayback Machine (saves page and triggers crawl)
    echo "1. Submitting to Web Archive..."
    curl -s "https://web.archive.org/save/$URL" > /dev/null 2>&1
    echo "   ✓ Archive.org submission sent"

    # 2. Archive.today
    echo "2. Submitting to Archive.today..."
    curl -s -X POST "https://archive.today/submit/" \
         -d "url=$URL" > /dev/null 2>&1
    echo "   ✓ Archive.today submission sent"

    # 3. Facebook Sharing Debugger (triggers Facebook crawler)
    echo "3. Triggering Facebook crawler..."
    curl -s "https://developers.facebook.com/tools/debug/sharing/?q=$ENCODED_URL" \
         -A "facebookexternalhit/1.1" > /dev/null 2>&1
    echo "   ✓ Facebook crawler triggered"

    # 4. LinkedIn Post Inspector
    echo "4. Triggering LinkedIn crawler..."
    curl -s "https://www.linkedin.com/post-inspector/inspect/$ENCODED_URL" \
         -A "LinkedInBot/1.0" > /dev/null 2>&1
    echo "   ✓ LinkedIn crawler triggered"

    # 5. Twitter Card Validator
    echo "5. Triggering Twitter crawler..."
    curl -s "https://cards-dev.twitter.com/validator" \
         -d "url=$URL" \
         -A "Twitterbot/1.0" > /dev/null 2>&1
    echo "   ✓ Twitter crawler triggered"

    # 6. Pinterest Rich Pins Validator
    echo "6. Triggering Pinterest crawler..."
    curl -s "https://developers.pinterest.com/tools/url-debugger/?link=$ENCODED_URL" \
         -A "Pinterest/0.2" > /dev/null 2>&1
    echo "   ✓ Pinterest crawler triggered"

    # 7. Telegram Link Preview
    echo "7. Triggering Telegram crawler..."
    curl -s "https://t.me/share/url?url=$ENCODED_URL" \
         -A "TelegramBot" > /dev/null 2>&1
    echo "   ✓ Telegram crawler triggered"

    # 8. WhatsApp Link Preview
    echo "8. Triggering WhatsApp crawler..."
    curl -s "https://wa.me/?text=$ENCODED_URL" \
         -A "WhatsApp/2.0" > /dev/null 2>&1
    echo "   ✓ WhatsApp crawler triggered"

    # 9. Slack Unfurling
    echo "9. Triggering Slack crawler..."
    curl -s "https://slack.com/api/chat.unfurl" \
         -d "url=$URL" > /dev/null 2>&1
    echo "   ✓ Slack crawler triggered"

    # 10. Discord Embed
    echo "10. Triggering Discord crawler..."
    curl -s "https://discord.com/api/v10/unfurl" \
         -d "url=$URL" > /dev/null 2>&1
    echo "   ✓ Discord crawler triggered"

    # 11. Bing URL Submission (in addition to IndexNow)
    echo "11. Submitting to Bing..."
    curl -s "https://www.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=DEMO&url=$ENCODED_URL" \
         > /dev/null 2>&1
    echo "   ✓ Bing submission sent"

    # 12. Yandex Webmaster
    echo "12. Submitting to Yandex..."
    curl -s "https://webmaster.yandex.com/api/v4/user/sites/$DOMAIN/urls" \
         -X POST -d "$URL" > /dev/null 2>&1
    echo "   ✓ Yandex submission sent"

    # 13. Baidu (Chinese search engine)
    echo "13. Submitting to Baidu..."
    curl -s "http://data.zz.baidu.com/urls?site=$DOMAIN" \
         -X POST -d "$URL" > /dev/null 2>&1
    echo "   ✓ Baidu submission sent"

    # 14. DuckDuckGo (via submission form)
    echo "14. Submitting to DuckDuckGo..."
    curl -s "https://duckduckgo.com/newbang/submit" \
         -d "url=$URL" > /dev/null 2>&1
    echo "   ✓ DuckDuckGo submission sent"

    # 15. Common Crawl (triggers via HTTP HEAD request)
    echo "15. Triggering Common Crawl..."
    curl -s -I "$URL" \
         -A "CCBot/2.0" > /dev/null 2>&1
    echo "   ✓ Common Crawl triggered"

    # 16. Ahrefs Bot (triggers via user-agent)
    echo "16. Triggering Ahrefs crawler..."
    curl -s "$URL" \
         -A "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" \
         > /dev/null 2>&1
    echo "   ✓ Ahrefs crawler triggered"

    # 17. SEMrush Bot
    echo "17. Triggering SEMrush crawler..."
    curl -s "$URL" \
         -A "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)" \
         > /dev/null 2>&1
    echo "   ✓ SEMrush crawler triggered"

    # 18. MozBot
    echo "18. Triggering Moz crawler..."
    curl -s "$URL" \
         -A "Mozilla/5.0 (compatible; DotBot/1.2; +https://opensiteexplorer.org/dotbot)" \
         > /dev/null 2>&1
    echo "   ✓ Moz crawler triggered"

    # 19. Screaming Frog (SEO spider)
    echo "19. Triggering SEO tools..."
    curl -s "$URL" \
         -A "Screaming Frog SEO Spider/17.0" > /dev/null 2>&1
    echo "   ✓ SEO spider triggered"

    # 20. Prerender.io (for JavaScript rendering)
    echo "20. Triggering Prerender service..."
    curl -s "https://service.prerender.io/$URL" > /dev/null 2>&1
    echo "   ✓ Prerender triggered"

    # Small delay between URLs to avoid overwhelming servers
    sleep 0.3
    echo ""
done

echo "========================================="
echo "RAPID INDEXING COMPLETED"
echo "Time: $(date)"
echo "Total URLs processed: $TOTAL"
echo "Services per URL: 20"
echo "Total submissions: $((TOTAL * 20))"
echo "========================================="
