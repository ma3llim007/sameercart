import { Editor } from "@tinymce/tinymce-react";
import React, { forwardRef, useId } from "react";
import { Controller } from "react-hook-form";

const baseTinyMceConfig = {
    branding: false,
    plugins: [
        "image",
        "advlist",
        "autolink",
        "lists",
        "link",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
        "quickbars",
        "autosave",
        "emoticons",
        "codesample",
        "pagebreak",
    ],
    toolbar:
        "undo redo | formatselect | fontsizeselect | fontselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | blockquote subscript superscript | link unlink anchor | codesample table emoticons | hr pagebreak charmap | fullscreen preview removeformat | styleselect searchreplace insertdatetime media image help",
    quickbars_selection_toolbar:
        "bold italic underline strikethrough | quicklink h1 h2 h3 h4 h5 h6 blockquote",
    content_style: "body { font-size:20px; }",
    autosave_interval: "30s",
    autosave_retention: "2m",
    skin: "oxide-dark",
    content_css: "dark",
    min_height: 200,
    quickbars_insert_toolbar: "",
    menubar: "file edit view insert format tools table help",
    toolbar_mode: "wrap",
    fontsize_formats: "12pt 14pt 16pt 18pt 24pt 36pt 48pt",
    block_formats:
        "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6; Code=pre",
    end_container_on_empty_block: true,
    link_context_toolbar: true,
    table_advtab: true,
    table_default_attributes: { border: "3" },
    tinycomments_mode: "embedded",
    tinycomments_author: "Mohd Sameer",
};

const RichTextEditor = forwardRef(
    (
        {
            name = "Description",
            control,
            defaultValue = "",
            placeholder = "",
            label = "",
            className = "",
            error = null,
            tinymceConfig = {},
            ...props
        },
        ref
    ) => {
        const id = useId();
        const mergedConfig = { ...baseTinyMceConfig, ...tinymceConfig }; // Merge base config with additional custom config

        return (
            <div className={`w-full ${className}`}>
                {label && (
                    <label className="inline-block mb-2 pl-1 text-base font-bold">
                        {label}
                        <span className="text-red-500 font-black"> *</span>
                    </label>
                )}
                <Controller
                    name={name}
                    id={id}
                    control={control}
                    defaultValue={defaultValue}
                    render={({
                        field: { onChange, value },
                        fieldState: { error: fieldError },
                    }) => (
                        <div className="w-full">
                            <div className="mb-2">
                                <Editor
                                    apiKey={
                                        import.meta.env.VITE_TINYMCE_API_KEY
                                    }
                                    value={value || ""}
                                    init={mergedConfig}
                                    onEditorChange={onChange}
                                    {...props}
                                    ref={ref}
                                    style={{
                                        border: "2px solid white",
                                    }}
                                />
                            </div>
                            {(error || fieldError) && (
                                <p className="text-red-700 font-bold my-2 text-base px-2">
                                    {error || fieldError?.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
        );
    }
);

export default RichTextEditor;
