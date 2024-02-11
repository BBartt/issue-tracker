"use client";
import { useState } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Button, Callout, TextField } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";

import axios from "axios";
import { z } from "zod";

// import SimpleMDE from "react-simplemde-editor";
const SimpleMDE = dynamic(async () => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <div>Loading SimpleMDE...</div>,
});
import "easymde/dist/easymde.min.css";

import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/app/components/Spinner";
import { ErrorMessage } from "@/app/components";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      setSubmitting(false);
      setError("An unexpected error occurred");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      <form className=" space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

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
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          Submit New Issue {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
