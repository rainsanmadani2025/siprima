const fs = require("fs");

const file = "src/app/dashboard/guru/siswa/page.tsx";
let content = fs.readFileSync(file, "utf-8");

// 1. Tambah import yang dibutuhkan
const oldImport = 'import { useToast } from "@/hooks/use-toast"';
const newImport = `import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"`;

if (!content.includes("Dialog")) {
  content = content.replace(oldImport, newImport);
}

// 2. Tambah state baru setelah state existing
const stateInsert = `const { toast } = useToast()`;
const newState = `const { toast } = useToast()

  // Tambah Siswa
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [parentList, setParentList] = useState<{ id: string; name: string }[]>([])
  const [formData, setFormData] = useState({
    nis: "",
    name: "",
    birthDate: "",
    gender: "L",
    address: "",
    parentId: "",
    classId: ""
  })`;

content = content.replace(stateInsert, newState);

// 3. Tambah fungsi fetchParentList setelah fetchTeacherClasses
const fetchClassEnd = `  })\n  }`;
const parentFetch = `  })

  const fetchParentList = async () => {
    try {
      const res = await fetch("/api/admin/parents")
      const data = await res.json()
      if (data.success) {
        setParentList(data.parents)
      }
    } catch (e) {
      console.error("Error fetching parents:", e)
    }
  }

  const handleAddSiswa = () => {
    setFormData({ nis: "", name: "", birthDate: "", gender: "L", address: "", parentId: "", classId: "" })
    fetchParentList()
    setDialogOpen(true)
  }

  const handleSubmitSiswa = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/guru/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        toast({ title: "Berhasil", description: "Siswa baru berhasil ditambahkan" })
        setDialogOpen(false)
        fetchStudents()
      } else {
        throw new Error(data.error || "Gagal menambahkan siswa")
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Gagal menambahkan siswa" })
    } finally {
      setSubmitting(false)
    }
  }`;

content = content.replace(fetchClassEnd, parentFetch);

fs.writeFileSync(file, content, "utf-8");
console.log("Bagian 1 selesai - state dan fungsi ditambahkan");
