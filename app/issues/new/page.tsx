"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Button, TextField } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

// import SimpleMDE from "react-simplemde-editor";
const SimpleMDE = dynamic(async () => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <div>Loading SimpleMDE...</div>,
});
import "easymde/dist/easymde.min.css";

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const { register, control, handleSubmit } = useForm<IssueForm>();
  const router = useRouter();

  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await axios.post("/api/issues", data);
        router.push("/issues");
      })}
    >
      <TextField.Root>
        <TextField.Input placeholder="Title" {...register("title")} />
      </TextField.Root>

      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => {
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
  );
};

export default NewIssuePage;
