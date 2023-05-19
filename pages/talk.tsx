import { useState } from "react";

export default function Talk() {
  const [talkArray, setTalkArray] = useState([
    "Me faça uma pergunta, estranho.",
  ]);
  const [questionInput, setQuestionInput] = useState("");

  async function submitHandler(event) {
    event.preventDefault();
    document.getElementById("question").setAttribute("disabled", "true");

    setTalkArray((oldArray) => {
      return [...oldArray, questionInput];
    });
    console.log(JSON.stringify({ question: questionInput }));

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setTalkArray((oldArray) => {
        document.getElementById("question").removeAttribute("disabled");
        return [...oldArray, data.result];
      });

      setQuestionInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      <main>
        <div>
          {talkArray.map((message) => {
            return <div key={message}>{message}</div>;
          })}
        </div>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            name="question"
            placeholder="Pergunte alguma coisa"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input type="submit" id="question" value="Perguntar" />
        </form>
      </main>
    </>
  );
}
