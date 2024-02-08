"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Button, Callout, TextField } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

// import SimpleMDE from "react-simplemde-editor";
const SimpleMDE = dynamic(async () => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <div>Loading SimpleMDE...</div>,
});
import "easymde/dist/easymde.min.css";
import { useState } from "react";

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const { register, control, handleSubmit } = useForm<IssueForm>();
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form
        className=" space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            setError("An unexpected error occurred");
          }
        })}
      >
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>

        <Controller
          name="description"
          control={control}
          defaultValue={""}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <SimpleMDE
                placeholder="Description"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            );
          }}
        />
        <Button type="submit">Submit New Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
