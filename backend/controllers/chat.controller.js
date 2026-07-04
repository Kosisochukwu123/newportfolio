const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",

          content: `

You are GDStudio AI assistant.

Information:

Services:
- MERN stack development
- Booking platforms
- Startup MVPs
- Payment integration
- UI/UX Design
- Custom dashboards
- API development

Rules:

1. Answer professionally
2. Keep responses short
3. Encourage leads
4. If user wants project:

Ask:

- Name
- Email
- Budget
- Project description

`,
        },

        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.json({
      success: true,

      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "AI error",
    });
  }
};
