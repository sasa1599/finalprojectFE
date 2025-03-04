"use client";

import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  ChangeEvent,
  FormEvent,
} from "react";
import { Store, Category, ProductFormData } from "@/types/product-types";
import {
  Bold,
  Italic,
  List,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
  submitText: string;
  loadingText: string;
  isEdit?: boolean;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

interface FormLabelProps {
  children: ReactNode;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [content, setContent] = useState(value || "");

  // Set up editor when component mounts
  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;

    // Set initial content
    editor.innerHTML = content;

    // Force LTR direction
    editor.dir = "ltr";
    editor.setAttribute("dir", "ltr");
    editor.lang = "en";
    editor.setAttribute("lang", "en");

    // Add event listener for input
    const handleInput = () => {
      const newContent = editor.innerHTML;
      setContent(newContent);
      onChange(newContent);
    };

    editor.addEventListener("input", handleInput);

    // Clean up
    return () => {
      editor.removeEventListener("input", handleInput);
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== content) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value, content]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value || "");
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
    }
  };

  // Use a custom insert method instead of paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");

    // Insert text at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      // Create text node with explicit direction
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);

      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      document.execCommand("insertText", false, text);
    }

    // Update content
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
    }
  };

  const ButtonStyle =
    "p-1.5 hover:bg-gray-100 rounded text-gray-700 transition-colors duration-150";

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className={ButtonStyle}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className={ButtonStyle}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className={ButtonStyle}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h3")}
          className={ButtonStyle}
          title="Heading"
        >
          <Heading className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className={ButtonStyle}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className={ButtonStyle}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className={ButtonStyle}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Editor - using conventional div instead of dangerouslySetInnerHTML */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] max-h-[300px] overflow-y-auto p-3 focus:outline-none 
    bg-white
    text-gray-900
    text-left rtl:text-right
    [&_*]:text-inherit
    [&_*]:direction-ltr
    [&_p]:my-1
    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2
    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
    [&_li]:my-1
    selection:bg-blue-200
    caret-blue-600
    break-words whitespace-pre-wrap"
        onPaste={handlePaste}
        spellCheck={false}
        suppressContentEditableWarning
        style={{
          direction: "ltr",
          unicodeBidi: "plaintext",
          textAlign: "left",
          WebkitTextFillColor: "inherit",
          textDecoration: "none",
          whiteSpace: "pre-wrap",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      />
    </div>
  );
};

const InputField = ({ className = "", ...props }: InputFieldProps) => (
  <input
    {...props}
    className={`w-full p-2 bg-white border border-gray-300 
    rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    text-gray-900 ${className}`}
  />
);

const SelectField = ({ className = "", ...props }: SelectFieldProps) => (
  <select
    {...props}
    className={`w-full p-2 bg-white border border-gray-300 
    rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    text-gray-900 ${className}`}
  />
);

const FormLabel = ({ children }: FormLabelProps) => (
  <label className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  submitText,
  loadingText,
  isEdit,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoriesAndStores();
  }, []);

  const fetchCategoriesAndStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const [categoriesResponse, storesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/store`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!categoriesResponse.ok) {
        throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
      }
      
      if (!storesResponse.ok) {
        throw new Error(`Failed to fetch stores: ${storesResponse.statusText}`);
      }

      const [categoriesData, storesData] = await Promise.all([
        categoriesResponse.json(),
        storesResponse.json(),
      ]);

      // Process categories data - handle different API response formats
      let categoryItems: Category[] = [];
      if (Array.isArray(categoriesData)) {
        categoryItems = categoriesData;
      } else if (categoriesData && typeof categoriesData === 'object') {
        // Check common API response patterns
        if (Array.isArray(categoriesData.data)) {
          categoryItems = categoriesData.data;
        } else if (categoriesData.results && Array.isArray(categoriesData.results)) {
          categoryItems = categoriesData.results;
        } else if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
          categoryItems = categoriesData.categories;
        }
      }

      // Process stores data - handle different API response formats
      let storeItems: Store[] = [];
      if (Array.isArray(storesData)) {
        storeItems = storesData;
      } else if (storesData && typeof storesData === 'object') {
        // Check common API response patterns
        if (Array.isArray(storesData.data)) {
          storeItems = storesData.data;
        } else if (storesData.results && Array.isArray(storesData.results)) {
          storeItems = storesData.results;
        } else if (storesData.stores && Array.isArray(storesData.stores)) {
          storeItems = storesData.stores;
        }
      }

      // Debug info
      console.log('Categories response:', categoriesData);
      console.log('Processed categories:', categoryItems);
      
      console.log('Stores response:', storesData);
      console.log('Processed stores:', storeItems);

      setCategories(categoryItems);
      setStores(storeItems);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, price: e.target.value });
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category_id: e.target.value });
  };

  const handleStoreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, store_id: e.target.value });
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, initial_quantity: e.target.value });
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        <p className="font-medium">Error loading form data:</p>
        <p>{error}</p>
        <button
          onClick={() => fetchCategoriesAndStores()}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmitForm}
      className="space-y-6 w-full max-w-2xl mx-auto"
    >
      <div className="space-y-2">
        <FormLabel>Product Name</FormLabel>
        <InputField
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <FormLabel>Description</FormLabel>
        <RichTextEditor
          value={formData.description}
          onChange={(newValue) =>
            setFormData({ ...formData, description: newValue })
          }
        />
      </div>

      <div className="space-y-2">
        <FormLabel>Price</FormLabel>
        <InputField
          type="number"
          value={formData.price}
          onChange={handlePriceChange}
          placeholder="Enter price"
          required
        />
      </div>

      <div className="space-y-2">
        <FormLabel>Category</FormLabel>
        <SelectField
          value={formData.category_id}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))
          ) : (
            <option value="" disabled>No categories available</option>
          )}
        </SelectField>
      </div>

      <div className="space-y-2">
        <FormLabel>Store</FormLabel>
        <SelectField
          value={formData.store_id}
          onChange={handleStoreChange}
          required
        >
          <option value="">Select Store</option>
          {Array.isArray(stores) && stores.length > 0 ? (
            stores.map((store) => (
              <option key={store.store_id} value={store.store_id}>
                {store.store_name}
              </option>
            ))
          ) : (
            <option value="" disabled>No stores available</option>
          )}
        </SelectField>
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <FormLabel>Initial Quantity</FormLabel>
          <InputField
            type="number"
            value={formData.initial_quantity}
            onChange={handleQuantityChange}
            placeholder="Enter initial quantity"
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? loadingText : submitText}
      </button>
    </form>
  );
}