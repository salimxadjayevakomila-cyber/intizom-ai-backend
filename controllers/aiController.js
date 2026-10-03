 const { GoogleGenAI } = require('@google/genai')

const AITrainer = require('../models/AiTrainer')

// ============================================================
// GEMINI AI
// ============================================================

const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY .env faylda topilmadi'
    )
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })
}

// ============================================================
// 1. CAMERA / IMAGE FOOD ANALYSIS
// ============================================================

exports.analyzeFood = async (req, res) => {
  try {
    const {
      image,
      imageBase64,
      foodName,
    } = req.body

    const imageData =
      image || imageBase64

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: 'Rasm yuborilmadi',
      })
    }

    if (
      typeof imageData !== 'string' ||
      !imageData.startsWith('data:image/')
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Rasm noto‘g‘ri formatda yuborildi',
      })
    }

    const ai = getAI()

    const base64Data =
      imageData.replace(
        /^data:image\/[\w.+-]+;base64,/,
        ''
      )

    const mimeMatch =
      imageData.match(
        /^data:(image\/[\w.+-]+);base64,/
      )

    const mimeType =
      mimeMatch?.[1] || 'image/jpeg'

    const prompt = `
You are the food vision and nutrition analysis AI for the INTIZOM AI application.

Your task is to identify the food shown in the image and estimate the nutrition of the VISIBLE PORTION.

IMPORTANT:
INTIZOM AI is used by users in Uzbekistan and Central Asia.

You MUST recognize and consider Uzbek, Central Asian, and regional cuisine before assuming the food is a generic international dish.

Examples include:

- Plov / Osh / Palov
- Manti
- Somsa / Samsa
- Lagman / Lag‘mon
- Shashlik
- Chuchvara
- Mastava
- Shurpa / Sho‘rva
- Dimlama
- Qozonkabob
- Norin
- Katlama
- Uzbek non
- Patir
- Obi non
- Tandir non
- Dolma
- Qovurma
- Kuksi
- Achichuk
- Various rice dishes
- Various meat and dough dishes
- Central Asian soups
- Central Asian dumplings
- Central Asian grilled meat
- Central Asian breads and pastries

Do not automatically classify an Uzbek/Central Asian dish as a generic Western food.

For example:
- Osh/plov should be recognized as plov/osh when appropriate.
- Manti should be recognized as manti rather than generic dumplings.
- Somsa should be recognized as somsa/samsa rather than generic pastry.
- Lagman should be recognized as lagman/lag‘mon rather than generic noodles.
- Uzbek non should be recognized as Uzbek bread when visible.

Analyze the visible portion carefully.

Consider:

1. Visible food type
2. Approximate portion size
3. Visible ingredients
4. Amount of rice, noodles, dough, meat, vegetables and other ingredients
5. Visible oil or fatty ingredients
6. Typical preparation methods for the identified dish
7. Whether the portion appears small, medium, or large

Do NOT pretend that image-based nutrition estimation is 100% exact.

Nutrition values are estimates because:
- exact ingredients may not be visible
- cooking oil may be hidden
- portion size may be uncertain
- recipes differ between households and restaurants

When uncertain, provide the most reasonable estimate based on the visible portion.

If the food is an Uzbek or Central Asian dish, use realistic nutritional assumptions for the typical preparation of that dish.

Return:

1. detected food name
2. estimated visible portion
3. estimated calories in kcal
4. estimated protein in grams
5. estimated carbohydrates in grams
6. estimated fat in grams

All nutrition values must be numbers.

The portion field must be a short human-readable string.

${
  foodName
    ? `
The user also entered this possible food name:

"${foodName}"

Use it as an additional clue, but compare it with the image.
If the image clearly shows something different, prioritize the visual evidence.
`
    : ''
}

IMPORTANT OUTPUT RULES:

- Return ONLY valid JSON.
- Do NOT use Markdown.
- Do NOT use code fences.
- Do NOT add explanations outside JSON.
- Do NOT include percentages.
- Nutrition values must be numeric.
- Calories must represent the visible portion.
- Do not provide a daily calorie target.

Return exactly this structure:

{
  "name": "Plov / Osh",
  "portion": "approximately 300 g",
  "calories": 520,
  "protein": 18,
  "carbs": 62,
  "fat": 21
}
`

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          prompt,
        ],
      })

    const rawText =
      response.text?.trim()

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message:
          'Gemini AI bo‘sh javob qaytardi',
      })
    }

    const cleanJson =
      rawText
        .replace(
          /^```json\s*/i,
          ''
        )
        .replace(
          /^```\s*/i,
          ''
        )
        .replace(
          /\s*```$/i,
          ''
        )
        .trim()

    let resultData

    try {
      resultData =
        JSON.parse(cleanJson)
    } catch (parseError) {
      console.error(
        'Gemini JSON parse error'
      )

      return res.status(500).json({
        success: false,
        message:
          'AI javobini JSON formatida o‘qib bo‘lmadi',
      })
    }

    const calories =
      Number(resultData.calories)

    const carbs =
      Number(
        resultData.carbs ??
          resultData.carbohydrates
      )

    const protein =
      Number(resultData.protein)

    const fat =
      Number(resultData.fat)

    const result = {
      name:
        resultData.name ||
        resultData.foodName ||
        resultData.food ||
        resultData.dishName ||
        'Unknown food',

      portion:
        resultData.portion ||
        resultData.portionSize ||
        'Unknown portion',

      calories:
        Number.isFinite(calories)
          ? Math.max(0, Math.round(calories))
          : 0,

      carbs:
        Number.isFinite(carbs)
          ? Math.max(0, Math.round(carbs))
          : 0,

      protein:
        Number.isFinite(protein)
          ? Math.max(0, Math.round(protein))
          : 0,

      fat:
        Number.isFinite(fat)
          ? Math.max(0, Math.round(fat))
          : 0,
    }

    if (
      !result.name ||
      result.calories <= 0
    ) {
      return res.status(500).json({
        success: false,
        message:
          'AI to‘g‘ri ovqat maʼlumotini qaytarmadi',
        data: result,
      })
    }

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error(
      'AI food analysis error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'AI tahlil xatoligi',
    })
  }
}

// ============================================================
// 2. AI CHAT
// ============================================================

exports.chatWithAI = async (
  req,
  res
) => {
  try {
    const { message } =
      req.body

    if (
      !message ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Xabar kiritilmadi',
      })
    }

    const ai = getAI()

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: message,

        config: {
          systemInstruction: `
You are the AI assistant inside the INTIZOM AI application.

Help users with:

- healthy eating
- general fitness
- daily movement
- workouts
- exercise habits
- meal ideas
- nutrition basics
- recovery
- sleep
- hydration

Give practical, simple and friendly answers.

Do not calculate or prescribe personal daily calorie targets from body measurements.

Do not recommend:
- starvation
- extreme dieting
- dangerous weight loss
- excessive exercise
- unsafe supplement use

Keep nutrition advice general and balanced.

If the user asks about a serious medical problem, recommend speaking with a qualified healthcare professional.

The user may be a teenager, so avoid restrictive dieting and aggressive weight-loss advice.
`,
        },
      })

    return res.status(200).json({
      success: true,
      reply:
        response.text || '',
    })
  } catch (error) {
    console.error(
      'AI Chat error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'AI Chat xatoligi',
    })
  }
}

// ============================================================
// 3. AI TRAINER
// ============================================================

exports.getTrainerPlan = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?.id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          'AI Trainer uchun login qilish kerak',
      })
    }

    /*
     * IMPORTANT:
     *
     * AI Trainer endi:
     * - weight
     * - height
     * - age
     * - gender
     * - calorie target
     * - water target
     * - BMR
     *
     * asosida ishlamaydi.
     *
     * Frontenddan faqat umumiy fitness
     * preference yuborilishi mumkin.
     */

    const {
      fitnessLevel,
      activityLevel,
      preferredActivity,
      availableDays,
      focus,
    } = req.body || {}

    const safeFitnessLevel =
      typeof fitnessLevel === 'string' &&
      fitnessLevel.trim()
        ? fitnessLevel.trim()
        : 'beginner'

    const safeActivityLevel =
      typeof activityLevel === 'string' &&
      activityLevel.trim()
        ? activityLevel.trim()
        : 'normal'

    const safePreferredActivity =
      typeof preferredActivity === 'string' &&
      preferredActivity.trim()
        ? preferredActivity.trim()
        : 'general movement'

    const safeAvailableDays =
      typeof availableDays === 'string' &&
      availableDays.trim()
        ? availableDays.trim()
        : 'flexible'

    const safeFocus =
      typeof focus === 'string' &&
      focus.trim()
        ? focus.trim()
        : 'healthy habits and general fitness'

    const ai = getAI()

    const prompt = `
You are the AI Trainer inside the INTIZOM AI application.

Create a safe, practical and motivating general wellness and fitness plan.

USER PREFERENCES:

Fitness level:
${safeFitnessLevel}

General activity level:
${safeActivityLevel}

Preferred activity:
${safePreferredActivity}

Available days:
${safeAvailableDays}

Current focus:
${safeFocus}

IMPORTANT:
Do NOT use or request body measurements.

Do NOT calculate:
- BMR
- daily calorie targets
- calorie deficits
- calorie limits
- water targets based on body weight
- automatic macro targets

Do not make recommendations based on weight, height, age or gender.

Focus on healthy habits and general fitness.

Create a structured response with these sections:

1. TODAY
Give a simple recommendation for today.

2. WEEKLY PLAN
Give a simple Monday-Sunday activity structure.

3. WORKOUT
Suggest safe general movement or exercise appropriate for the stated fitness level.

4. REST & RECOVERY
Give practical recovery, sleep and rest guidance.

5. NUTRITION HABITS
Give general balanced-food guidance without calorie restriction or numerical calorie targets.

6. HYDRATION
Give general hydration habits without calculating a personal water target.

7. MOTIVATION
Give one short encouraging message.

SAFETY:

- No starvation.
- No extreme diets.
- No aggressive weight loss.
- No excessive exercise.
- No dangerous challenges.
- No restrictive calorie targets.
- No medical diagnosis.
- Keep recommendations appropriate for general wellness.
- If a medical issue is mentioned, recommend professional medical advice.

Make the response easy to read.

Use short sections and bullet points.

Return only the plan text.
`

    const response =
      await ai.models.generateContent({
        model:
          'gemini-3.8-flash',

        contents: prompt,
      })

    const plan =
      response.text?.trim() || ''

    if (!plan) {
      return res.status(500).json({
        success: false,
        message:
          'AI Trainer bo‘sh javob qaytardi',
      })
    }

    /*
     * Eski body-metric ma'lumotlarini
     * yangi AI Trainer documentiga
     * saqlamaymiz.
     *
     * Faqat umumiy preference + plan.
     */
    const savedTrainer =
      await AITrainer.findOneAndUpdate(
        {
          user: userId,
        },

        {
          $set: {
            user: userId,

            fitnessLevel:
              safeFitnessLevel,

            activityLevel:
              safeActivityLevel,

            preferredActivity:
              safePreferredActivity,

            availableDays:
              safeAvailableDays,

            focus:
              safeFocus,

            plan,

            lastGeneratedAt:
              new Date(),
          },

          /*
           * Eski schema fieldlari mavjud
           * bo‘lsa ham ularni yangilamaymiz.
           *
           * Agar schema'da strict mode ishlayotgan
           * bo‘lsa, modelni ham keyin moslashtiramiz.
           */
        },

        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

    return res.status(200).json({
      success: true,
      plan,
      data: savedTrainer,
    })
  } catch (error) {
    console.error(
      'AI Trainer error:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'AI Trainer xatoligi',
    })
  }
}