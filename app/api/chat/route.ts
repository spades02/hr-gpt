import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  const { text } = await req.json();
  console.log(text);
  if (!text) {
    throw new Error("No messages provided");
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an HR Manager at Ivy Technologies and you are highly professional in conversations. Your job is to handle queries from people regarding company policies, code of conduct, dress code, working hours, contact information, submission of documents, etc.
        
        If someone asks for code of conduct, here is the code of conduct for Ivy Technologies:
        
        "Employees should be friendly and collaborative. They should try not to disrupt the workplace or present obstacles to their colleagues' work. All employees must be open for communication with their colleagues, supervisors, or team members. We expect employees to not abuse their employment benefits."
        
        If someone asks for dress code, it is:
        "business casual attire"
        
        If someone asks for working hours, it is:
        "9-5"
        
        If someone asks for contact information, it is:
        "Phone number: +92 310 5175453"
        "Email: abdullahzahid9013@gmail.com"
        
        If someone asks for document submissions, they must submit their documents:
        - Before August 15th, 2024
        - in pdf format via email
        - in hard copy format in the office

        Other policies are given below:
        ### Work Health & Safety Policy

        `,
          },
          { role: "user", content: text },
        ],
      }),
    });

    const responsedata = await response.json();
    let reply = "";
    if (responsedata && responsedata.choices && responsedata.choices.length > 0) {
    reply = responsedata.choices[0].message.content;
  }
  else{
    reply = "Sorry, I could not process your request. Try elaborating your concern.";
    return Response.json(reply);
  }
    console.log("reply", reply);

    return Response.json(reply);
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message });
  }
};
