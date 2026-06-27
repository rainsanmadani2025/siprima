const fs = require("fs");

const file = "src/app/dashboard/guru/siswa/page.tsx";
let content = fs.readFileSync(file, "utf-8");

// 1. Tambah tombol "Tambah Siswa" di header
const oldHeader = `<Plus className="mr-2 h-4 w-4" />
          Tambah Data`;
const newHeader = `<Plus className="mr-2 h-4 w-4" />
          Tambah Data
          <Button onClick={handleAddSiswa} className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Siswa
          </Button>`;

content = content.replace(oldHeader, newHeader);

// 2. Tambah Dialog form sebelum penutup </DashboardLayout>
const dialogForm = `      {/* Dialog Tambah Siswa */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Siswa Baru</DialogTitle>
            <DialogDescription>
              Isi data siswa baru. Data akan langsung terlihat oleh admin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitSiswa}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nis">NIS *</Label>
                <Input id="nis" value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })} placeholder="Nomor Induk Siswa" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap siswa" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Jenis Kelamin *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Alamat siswa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parentId">Orang Tua *</Label>
                <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                  <SelectTrigger><SelectValue placeholder="Pilih orang tua" /></SelectTrigger>
                  <SelectContent>
                    {parentList.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="classId">Kelas</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value })}>
                  <SelectTrigger><SelectValue placeholder="Pilih kelas (opsional)" /></SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tambah Siswa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>`;

// Ganti penutup terakhir
content = content.replace(/    <\/DashboardLayout>\s*$/, dialogForm);

fs.writeFileSync(file, content, "utf-8");
console.log("Bagian 2 selesai - tombol dan dialog ditambahkan");
