import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNotePayload } from "@/lib/api";
import type { NoteTag } from "../../types/note";

interface NoteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50")
    .required("Required"),
  content: Yup.string().max(500, "Maximum 500"),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS).required("Select a tag"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  return (
    <Formik<CreateNotePayload>
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values) => mutate(values)}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <span className={css.error}>
              <ErrorMessage name="title" />
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <span className={css.error}>
              <ErrorMessage name="content" />
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <span className={css.error}>
              <ErrorMessage name="tag" />
            </span>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isPending || isSubmitting || !isValid}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
