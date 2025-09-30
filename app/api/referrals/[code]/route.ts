import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster";

interface Params {
  code: string
}

// GET: Validar código de referral
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const client = new MongoClient(MONGODB_URI);

  try {
    const { code } = await params

    if (!code) {
      return NextResponse.json(
        { error: 'Código não fornecido' },
        { status: 400 }
      )
    }

    await client.connect();
    const db = client.db('jc-hair-studio-ecommerce');
    const referralCodesCollection = db.collection('referral_codes');

    const referralCode = await referralCodesCollection.findOne({ code });

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Código de referral não encontrado' },
        { status: 404 }
      )
    }

    if (!referralCode.isActive) {
      return NextResponse.json(
        { error: 'Código de referral inativo' },
        { status: 400 }
      )
    }

    if (referralCode.currentUses >= referralCode.maxUses) {
      return NextResponse.json(
        { error: 'Código de referral atingiu limite de usos' },
        { status: 400 }
      )
    }

    if (referralCode.validTo && referralCode.validTo < new Date()) {
      return NextResponse.json(
        { error: 'Código de referral expirado' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      referralCode: {
        id: referralCode._id,
        code: referralCode.code,
        referrerRewardType: referralCode.referrerRewardType,
        referrerRewardValue: referralCode.referrerRewardValue,
        refereeRewardType: referralCode.refereeRewardType,
        refereeRewardValue: referralCode.refereeRewardValue,
        currentUses: referralCode.currentUses,
        maxUses: referralCode.maxUses,
        validTo: referralCode.validTo
      }
    })
  } catch (error) {
    console.error('Erro ao validar código de referral:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await client.close();
  }
}