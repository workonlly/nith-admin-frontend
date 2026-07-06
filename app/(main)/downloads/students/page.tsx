"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Presentation,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
} from "lucide-react";

// Types

interface StudentsDocument {
  id: number;
  rank: number;
  type: "faculty" | "students" | "miscellaneous";
  category_en: "ug" | "pg" | "doctoral";
  category_hi: string;
  title_en: string;
  title_hi: string;
  particulars_en: string;
  particulars_hi: string;
  name_en: string;
  name_hi: string;
  form_type: "pdf" | "word" | "both";
  file_url: string;
  word_url?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

interface PageMeta {
  id?: number;
  page_type: "faculty" | "students" | "miscellaneous";
  heading_en: string;
  heading_hi: string;
  subheading_en: string;
  subheading_hi: string;
}


type TabType = "ug" | "pg" | "doctoral";

interface DownloadsState {
  ug: StudentsDocument[];
  pg: StudentsDocument[];
  doctoral: StudentsDocument[];
}

interface FormDataType {
  rank: number;
  type: "students";
  category_en: "ug" | "pg" | "doctoral";
  category_hi: string;
  title_en: string;
  title_hi: string;
  particulars_en: string;
  particulars_hi: string;
  name_en: string;
  name_hi: string;
  form_type: "pdf" | "word" | "both";
}

interface TabDef {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabDef[] = [
  {
    id: "ug",
    label: "UG",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "pg",
    label: "PG",
    icon: <FileSpreadsheet className="w-5 h-5" />,
  },
  {
    id: "doctoral",
    label: "DOCTORAL",
    icon: <Presentation className="w-5 h-5" />,
  },
];

export default function StudentDownloadPage() {
  const API_BASE = "http://localhost:4000/v1/downloads";

  // States

  const [activeTab, setActiveTab] = useState<TabType>("ug");

  const [documents, setDocuments] = useState<DownloadsState>({
    ug: [],
    pg: [],
    doctoral: [],
  });

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);

    const [metaData, setMetaData] = useState<PageMeta[]>([]);

  const [showMetaForm, setShowMetaForm] = useState(false);

  const [editableFields, setEditableFields] = useState({
  heading_en: false,
  heading_hi: false,
  subheading_en: false,
  subheading_hi: false,
});

const isAnyFieldEditable =
  editableFields.heading_en ||
  editableFields.heading_hi ||
  editableFields.subheading_en ||
  editableFields.subheading_hi;

  const [metaExists, setMetaExists] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);

  const wordInputRef = useRef<HTMLInputElement>(null);

  const currentMeta = metaData.find(
  (m) => m.page_type === "students"
);


  // Helper

  const getCategoryByTab = (tab: TabType): "ug" | "pg" | "doctoral" => {
    switch (tab) {
      case "ug":
        return "ug";

      case "pg":
        return "pg";

      case "doctoral":
        return "doctoral";

      default:
        return "ug";
    }
  };

  // Form State

  const [formData, setFormData] = useState<FormDataType>({
    rank: 1,
    type: "students",
    category_en: "ug",
    category_hi: "",
    title_en: "",
    title_hi: "",
    particulars_en: "",
    particulars_hi: "",
    name_en: "",
    name_hi: "",
    form_type: "pdf",
  });

     const [metaFormData, setMetaFormData] = useState<PageMeta>({
  page_type: "students",
  heading_en: "",
  heading_hi: "",
  subheading_en: "",
  subheading_hi: "",
});

  // Reset Form

  const cancelEdit = () => {
    setIsEditing(null);

    setFormData({
      rank: documents[activeTab].length + 1,
      type: "students",
      category_en: getCategoryByTab(activeTab),
      category_hi: "",
      title_en: "",
      title_hi: "",
      particulars_en: "",
      particulars_hi: "",
      name_en: "",
      name_hi: "",
      form_type: "pdf",
    });

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }

    if (wordInputRef.current) {
      wordInputRef.current.value = "";
    }

    setShowForm(false);
  };

  // Tab Change

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      rank: documents[activeTab].length + 1,
      category_en: getCategoryByTab(activeTab),
    }));

    setShowForm(false);

    setIsEditing(null);
  }, [activeTab, documents]);


  //for heading and subheading
useEffect(() => {
  const existing = metaData.find(
    (m) => m.page_type === "students"
  );

  if (existing) {
    setMetaFormData(existing);
    setMetaExists(true);
  } else {
    setMetaFormData({
      page_type: "students",
      heading_en: "",
      heading_hi: "",
      subheading_en: "",
      subheading_hi: "",
    });

    setMetaExists(false);
  }
}, [metaData]);


  // Fetch Documents

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/data`);

      if (!res.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data: StudentsDocument[] = await res.json();

      const studentsDocs = data.filter((doc) => doc.type === "students");

      const organizedData: DownloadsState = {
        ug: studentsDocs.filter((doc) => doc.category_en === "ug"),

        pg: studentsDocs.filter((doc) => doc.category_en === "pg"),

        doctoral: studentsDocs.filter((doc) => doc.category_en === "doctoral"),
      };

      setDocuments(organizedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    //fetch for the heading and subheading
       const fetchMeta = async () => {
       try {
         const res = await fetch(`${API_BASE}/meta`);
        const data = await res.json();

console.log("META API RESPONSE:", data);

if (Array.isArray(data)) {
  setMetaData(data);
} else if (Array.isArray(data.data)) {
  setMetaData(data.data);
} else {
  setMetaData([]); // fallback
}
       } catch (err) {
         console.error(err);
       }
     };

     useEffect(() => {
         fetchDocuments();
         fetchMeta();
       }, []);



  // Input Change

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "rank" ? Number(value) : value,
    }));
  };

   // heading and subheading input
        const handleMetaChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const { name, value } = e.target;

        setMetaFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };


  // Edit

  const handleEdit = (doc: StudentsDocument) => {
   
    setIsEditing(doc.id);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (wordInputRef.current) wordInputRef.current.value = "";
    setShowForm(true);

    setFormData({
      rank: doc.rank,
      type: "students",
      category_en: doc.category_en,
      category_hi: doc.category_hi,
      title_en: doc.title_en,
      title_hi: doc.title_hi,
      particulars_en: doc.particulars_en,
      particulars_hi: doc.particulars_hi,
      name_en: doc.name_en,
      name_hi: doc.name_hi,
      form_type: doc.form_type,
      
    });
  };

  // Delete

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/data/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      await fetchDocuments();

      alert("Document deleted successfully");
    } catch (err) {
      console.error(err);

      alert("Error deleting document");
    }
  };

 //meta delete 
const handleMetaDelete = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/meta/students` , 
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.log(text);
      throw new Error("Delete failed");
    }

    await fetchMeta();

    setShowMetaForm(false);
    setMetaExists(false);
 
    alert("Deleted successfully");
  } catch (err) {
    console.error(err);
  }
};

  
  // Submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pdfFile = pdfInputRef.current?.files?.[0];
    const wordFile = wordInputRef.current?.files?.[0];

    if (!isEditing) {
      if (formData.form_type === "pdf" && !pdfFile) {
        alert("PDF file is required");
        return;
      }

      if (formData.form_type === "word" && !wordFile) {
        alert("Word file is required");
        return;
      }

      if (formData.form_type === "both") {
        if (!pdfFile || !wordFile) {
          alert("Both PDF and Word files are required");
          return;
       }
      }
    }
    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("rank", String(formData.rank));

      data.append("type", formData.type);

      data.append("category_en", formData.category_en);

      data.append("category_hi", formData.category_hi);

      data.append("title_en", formData.title_en);

      data.append("title_hi", formData.title_hi);

      data.append("particulars_en", formData.particulars_en);

      data.append("particulars_hi", formData.particulars_hi);

      data.append("name_en", formData.name_en);

      data.append("name_hi", formData.name_hi);

      data.append("form_type", formData.form_type);

      if (
        (formData.form_type === "pdf" || formData.form_type === "both") &&
        pdfInputRef.current?.files?.[0]
      ) {
        data.append("pdf_file", pdfInputRef.current.files[0]);
      }

      if (
        (formData.form_type === "word" || formData.form_type === "both") &&
        wordInputRef.current?.files?.[0]
      ) {
        data.append("word_file", wordInputRef.current.files[0]);
      }

      let res;

      if (isEditing) {
        res = await fetch(`${API_BASE}/data/${isEditing}`, {
          method: "PUT",
          body: data,
        });
      } else {
        res = await fetch(`${API_BASE}/data`, {
          method: "POST",
          body: data,
        });
      }

      if (!res.ok) {
        const errText = await res.text(); //extra
        console.log(errText); //extra
        throw new Error(errText || "Save failed");
      }

      await fetchDocuments();

      cancelEdit();

      alert(
        isEditing
          ? "Document updated successfully"
          : "Document added successfully",
      );
    } catch (err) {
      console.error(err);

      alert("Error saving document");
    } finally {
      setSubmitting(false);
    }
  };


    // heading and subheading submit
const handleMetaSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const existing = metaData.find(
      (m) => m.page_type === "students"
    );

    const isEdit = !!existing;

    const payload = {
      ...metaFormData,
      page_type: "students" , 
    };

    const url = isEdit
      ? `${API_BASE}/meta/${payload.page_type}`
      : `${API_BASE}/meta`;

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed");

    await fetchMeta();

    setEditableFields({
      heading_en: false,
      heading_hi: false,
      subheading_en: false,
      subheading_hi: false,
    });

    setShowMetaForm(false);

    alert(isEdit ? "Updated successfully" : "Created successfully");
  } catch (err) {
    console.error(err);
  }
};


  // Current Docs

  const currentDocs = documents[activeTab];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Top Header */}

      <div className="bg-linear-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-8 h-8" />

          <h1 className="text-3xl font-bold">Student Downloads</h1>
        </div>

        <p className="text-white/90">
          Access academic documents, forms, and schedules
        </p>
        <div className="relative">
        <button
             type="button"
onClick={() => {
  setShowMetaForm(true);

  const existing = metaData.find(
    (m) => m.page_type === "students"
  );

  if (existing) {
    setMetaFormData(existing);
    setMetaExists(true);
  } else {
    setMetaFormData({
      page_type: "students" , 
      heading_en: "",
      heading_hi: "",
      subheading_en: "",
      subheading_hi: "",
    });
    setMetaExists(false);
  }
}}
             className="absolute -top-20 right-0 bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                Add Heading & Subheading
             </button>
          </div>
      </div>

      {/* form */}


{showMetaForm && (
  <div className="p-6 bg-gray-50 border-b border-gray-200">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold">
        {isAnyFieldEditable
  ? "Edit Heading & Subheading"
  : "View Heading & Subheading"}
      </h3>

      <button
        aria-label="button"
        type="button"
        onClick={() => setShowMetaForm(false)}
      >
        <X size={20} />
      </button>
    </div>

    <form
      onSubmit={handleMetaSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Page Type (LOCKED) */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase">
          Type
        </label>

        <select
          title="page_type"
          name="page_type"
          value={metaFormData.page_type}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        >
          <option value="faculty">Faculty</option>
          <option value="students">Students</option>
          <option value="miscellaneous">Miscellaneous</option>
        </select>
      </div>

      {/* Heading EN */}
      <div className="flex items-center gap-2">
        <div className="w-full">
          <label className="block text-xs font-semibold mb-1 uppercase">
            Heading English
          </label>

          <input
          title="button"
            name="heading_en"
            value={metaFormData.heading_en || ""}
            onChange={handleMetaChange}
            disabled={!editableFields.heading_en}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
        title="Edit"
          type="button"
onClick={() =>
  setEditableFields({
    heading_en: true,
    heading_hi: false,
    subheading_en: false,
    subheading_hi: false,
  })
}
          className="mt-5 px-2 py-2 border rounded hover:bg-gray-100"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {/* Heading HI */}
      <div className="flex items-center gap-2">
        <div className="w-full">
          <label className="block text-xs font-semibold mb-1 uppercase">
            Heading Hindi
          </label>

          <input
          title="button"
            name="heading_hi"
            value={metaFormData.heading_hi || ""}
            onChange={handleMetaChange}
            disabled={!editableFields.heading_hi}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
        title="Edit"
          type="button"
onClick={() =>
  setEditableFields({
    heading_en: false,
    heading_hi: true,
    subheading_en: false,
    subheading_hi: false,
  })
}
          className="mt-5 px-2 py-2 border rounded hover:bg-gray-100"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {/* Subheading EN */}
      <div className="flex items-center gap-2">
        <div className="w-full">
          <label className="block text-xs font-semibold mb-1 uppercase">
            Subheading English
          </label>

          <input
          title="button"
            name="subheading_en"
            value={metaFormData.subheading_en || ""}
            onChange={handleMetaChange}
          disabled={!editableFields.subheading_en}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
        title="Edit"
          type="button"
onClick={() =>
  setEditableFields({
    heading_en: false,
    heading_hi: false,
    subheading_en: true,
    subheading_hi: false,
  })
}
          className="mt-5 px-2 py-2 border rounded hover:bg-gray-100"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {/* Subheading HI */}
      <div className="flex items-center gap-2">
        <div className="w-full">
          <label className="block text-xs font-semibold mb-1 uppercase">
            Subheading Hindi
          </label>

          <input
          title="button"
            name="subheading_hi"
            value={metaFormData.subheading_hi || ""}
            onChange={handleMetaChange}
            disabled={!editableFields.subheading_hi}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
        title="Edit"
          type="button"
onClick={() =>
  setEditableFields({
    heading_en: false,
    heading_hi: false,
    subheading_en: false,
    subheading_hi: true,
  })
}
          className="mt-5 px-2 py-2 border rounded hover:bg-gray-100"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {/* Buttons */}
      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={() => setShowMetaForm(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        {/* DELETE */}
        {metaExists && (
          <button
            type="button"
            onClick={handleMetaDelete}
            className="px-6 py-2 bg-[#631012] text-white rounded flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}

        {/* SAVE / UPDATE */}
        <button
          type="submit"
          className="px-6 py-2 bg-[#631012] text-white rounded flex items-center gap-2"
        >
          <Save size={16} />
          <span>{metaExists ? "Update" : "Save"}</span>
        </button>
      </div>
    </form>
  </div>
)}
  
      {/* Main Card */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}

        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-label={tab.label}
                title={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 flex items-center gap-2 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#631012] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}

                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Header */}

        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#171717]">
            {activeTab === "ug" && "UG Students"}

            {activeTab === "pg" && "PG Students"}

            {activeTab === "doctoral" && "DOCTORAL"}
          </h2>

          <button
            type="button"
            aria-label="Add New Document"
            title="Add New Document"
            onClick={() => {
              if (showForm) {
                cancelEdit();
              } else {
                setShowForm(true);
              }
            }}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />

            <span>{showForm ? "Close Form" : "Add New Document"}</span>
          </button>
        </div>

        {/* Form */}

        {showForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? "Update Document" : "Add New Document"}
              </h3>

              <button
                type="button"
                aria-label="Close Form"
                title="Close Form"
                onClick={cancelEdit}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="rank"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Rank
                </label>

                <input
                  id="rank"
                  type="number"
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Type
                </label>

                <input
                  id="type"
                  type="text"
                  value={formData.type}
                  readOnly
                  className="w-full p-2 border border-gray-200 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Category
                </label>

                <input
                  id="category"
                  type="text"
                  value={formData.category_en}
                  readOnly
                  className="w-full p-2 border border-gray-200 bg-gray-100 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="category_hi"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Category Hindi
                </label>

                <input
                  id="category_hi"
                  type="text"
                  name="category_hi"
                  value={formData.category_hi}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="title_en"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Title English
                </label>

                <input
                  id="title_en"
                  type="text"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="title_hi"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Title Hindi
                </label>

                <input
                  id="title_hi"
                  type="text"
                  name="title_hi"
                  value={formData.title_hi}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="particulars_en"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Particulars English
                </label>

                <input
                  id="particulars_en"
                  type="text"
                  name="particulars_en"
                  value={formData.particulars_en}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="particulars_hi"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Particulars Hindi
                </label>

                <input
                  id="particulars_hi"
                  type="text"
                  name="particulars_hi"
                  value={formData.particulars_hi}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="name_en"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Name / Dept English
                </label>

                <input
                  id="name_en"
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="name_hi"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Name / Dept Hindi
                </label>

                <input
                  id="name_hi"
                  type="text"
                  name="name_hi"
                  value={formData.name_hi}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="form_type"
                  className="block text-xs font-semibold mb-1 uppercase"
                >
                  Form Type
                </label>

                <select
                  id="form_type"
                  name="form_type"
                  value={formData.form_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="pdf">PDF</option>

                  <option value="word">WORD</option>
                  <option value="both">BOTH</option>
                </select>
              </div>

              {(formData.form_type === "pdf" ||
                formData.form_type === "both") && (
                <div>
                  <label
                    htmlFor="pdf_upload"
                    className="block text-xs font-semibold mb-1 uppercase"
                  >
                    Upload PDF
                  </label>

                  <input
                    id="pdf_upload"
                    type="file"
                    accept="application/pdf"
                    ref={pdfInputRef}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                  />
                </div>
              )}

              {(formData.form_type === "word" ||
                formData.form_type === "both") && (
                <div>
                  <label
                    htmlFor="word_upload"
                    className="block text-xs font-semibold mb-1 uppercase"
                  >
                    Upload Word File
                  </label>

                  <input
                    id="word_upload"
                    type="file"
                    accept=".doc,.docx"
                    ref={wordInputRef}
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                  />
                </div>
              )}

              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  title="Cancel"
                  aria-label="Cancel"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  title={isEditing ? "Update Document" : "Save Document"}
                  aria-label={isEditing ? "Update Document" : "Save Document"}
                  disabled={submitting}
                  className="px-6 py-2 bg-[#631012] text-white rounded flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}

                  <span>{isEditing ? "Update" : "Save"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}

        <div className="overflow-x-auto p-6">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <table className="w-full border-collapse min-w-250">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="p-4 font-semibold">Srno.</th>

                  <th className="p-4 font-semibold">Title</th>

                  <th className="p-4 font-semibold">Particulars</th>

                  <th className="p-4 font-semibold">Form Type</th>

                  <th className="p-4 font-semibold">Name/Dept</th>

                  <th className="p-4 font-semibold">Downloads</th>

                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentDocs.length > 0 ? (
                  currentDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4">{doc.rank}</td>

                      <td className="p-4">{doc.title_en}</td>

                      <td className="p-4">{doc.particulars_en}</td>

                      <td className="p-4 uppercase">{doc.form_type}</td>

                      <td className="p-4 uppercase">{doc.name_en}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          {(doc.form_type === "pdf" ||
                            doc.form_type === "both") &&
                            doc.file_url && (
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download PDF"
                                aria-label="Download PDF"
                                className="text-red-600"
                              >
                                PDF
                              </a>
                            )}

                          {(doc.form_type === "word" ||
                            doc.form_type === "both") &&
                            doc.word_url && (
                              <a
                                href={doc.word_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download Word"
                                aria-label="Download Word"
                                className="text-blue-600"
                              >
                                Word
                              </a>
                            )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            title="Edit Document"
                            aria-label="Edit Document"
                            onClick={() => handleEdit(doc)}
                            className="p-2 rounded hover:bg-gray-100 text-[#631012]"
                          >
                            <Edit2 size={18} />
                          </button>

                          <button
                            type="button"
                            title="Delete Document"
                            aria-label="Delete Document"
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 rounded hover:bg-red-50 text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
