import * as React from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Checkbox } from "~/components/ui/checkbox";

export const meta: MetaFunction = () => {
  return [
    { title: "Knowledge Bot" },
    { name: "description", content: "Ask questions to the knowledge bot" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const question = formData.get("question");
  const knowledge = formData.get("knowledge");
  if (!question || typeof question !== "string") return;

  const { answer } = await fetch(
    `https://knowledge-bot.jnoahjohnson.workers.dev/${
      knowledge === "on" ? "ask" : "dumb-ask"
    }?question=${question}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch answer");
      }
      return res.json();
    })
    .then(
      (data) =>
        data as {
          answer: string;
        }
    );

  console.log({ question, answer });

  return json({
    question,
    answer,
    customKnowledge: !knowledge || knowledge !== "on",
  });
}

export default function Ask() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const [messages, setMessages] = React.useState<
    { question: string; answer: string; customKnowledge: boolean }[]
  >([]);

  React.useEffect(() => {
    if (
      data &&
      !messages.some(
        (m) => m.question === data.question && m.answer === data.answer
      )
    ) {
      setMessages((prev) => [data, ...prev]);
    }
  }, [data, messages]);

  return (
    <Form
      method="post"
      className="max-w-2xl mx-auto py-4 max-h-screen overflow-hidden flex flex-col"
    >
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Bot</CardTitle>
          <CardDescription>Feel Free to Ask Me Questions!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Textarea name="question" placeholder="When was pizza invented?" />
          <Button type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state == "submitting" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Ask
          </Button>

          <div className="flex items-center gap-2 mt-1">
            <Checkbox id="knowledge" name="knowledge" />
            <label
              htmlFor="knowledge"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Disable Custom Knowledge
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/train">
            <Button variant="outline">Train Me</Button>
          </Link>
        </CardFooter>
      </Card>

      {/* <div className="overflow-auto flex-1"> */}
      <div
        ref={parent}
        className="mt-4 flex flex-col gap-4 overflow-auto flex-1"
      >
        {messages.map((message) => (
          <Alert
            key={`${message.question}-${message.answer}`}
            variant={message.customKnowledge ? "default" : "destructive"}
          >
            <QuestionMarkIcon />
            <AlertTitle>{message.question}</AlertTitle>
            <AlertDescription>{message.answer}</AlertDescription>
          </Alert>
        ))}
      </div>
      {/* </div> */}
    </Form>
  );
}
