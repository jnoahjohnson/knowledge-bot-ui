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
import { Loader2 } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Knowledge Bot" },
    { name: "description", content: "Ask questions to the knowledge bot" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text");
  if (!text || typeof text !== "string") return;

  const response = await fetch(
    "https://knowledge-bot.jnoahjohnson.workers.dev/notes",
    {
      method: "POST",
      body: JSON.stringify({ text }),
    }
  ).then((res) => {
    if (!res.ok) {
      return false;
    }

    return true;
  });

  return json({ status: response ? "success" : "error" });
}

export default function Ask() {
  const { toast } = useToast();
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (data?.status === "success") {
      toast({
        description: "Data added successfully!",
      });
      formRef.current?.reset();
    } else if (data?.status === "error") {
      toast({
        variant: "destructive",
        description: "Failed to add data",
      });
    }
  }, [data, toast]);

  return (
    <Form
      method="post"
      className="max-w-2xl mx-auto py-4 h-full overflow-hidden"
      ref={formRef}
    >
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Bot</CardTitle>
          <CardDescription>Teach me new things!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Textarea name="text" placeholder="Pizza was invented a while ago" />
          <Button type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state == "submitting" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Data
          </Button>
        </CardContent>
        <CardFooter>
          <Link to="/ask">
            <Button variant="outline">Ask Me</Button>
          </Link>
        </CardFooter>
      </Card>
    </Form>
  );
}
