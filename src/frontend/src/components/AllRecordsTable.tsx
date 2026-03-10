import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteRecord,
  useGetAllRecords,
  useUpdateRecord,
} from "../hooks/useQueries";
import type { BrokerageRecord } from "../hooks/useQueries";

type Filter = "All" | "Received" | "Pending";

function fmt(n: number | undefined | null) {
  if (n == null) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function RemarkBadge({ remark }: { remark: string }) {
  if (remark === "Received") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        Received
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
      Pending
    </span>
  );
}

export function AllRecordsTable() {
  const { data: records = [], isLoading } = useGetAllRecords();
  const updateRecord = useUpdateRecord();
  const deleteRecord = useDeleteRecord();

  const [filter, setFilter] = useState<Filter>("All");
  const [editRecord, setEditRecord] = useState<BrokerageRecord | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const filtered =
    filter === "All" ? records : records.filter((r) => r.remark === filter);
  const sorted = [...filtered].sort(
    (a, b) => Number(a.serialNumber) - Number(b.serialNumber),
  );

  const receivedCount = records.filter((r) => r.remark === "Received").length;
  const pendingCount = records.filter((r) => r.remark === "Pending").length;

  // Totals from filtered records
  const totalLoan = filtered.reduce((sum, r) => sum + (r.loanAmount ?? 0), 0);
  const totalGross = filtered.reduce((sum, r) => sum + (r.grossAmount ?? 0), 0);
  const totalNet = filtered.reduce((sum, r) => sum + (r.netAmount ?? 0), 0);

  const openEdit = (r: BrokerageRecord) => {
    setEditRecord(r);
    setEditForm({
      finance: r.finance,
      customerName: r.customerName,
      mcf: r.mcf,
      product: r.product,
      grossAmount: r.grossAmount != null ? String(r.grossAmount) : "",
      netAmount: r.netAmount != null ? String(r.netAmount) : "",
      loanAmount: r.loanAmount != null ? String(r.loanAmount) : "",
      brokerageReceivedDate: r.brokerageReceivedDate ?? "",
      bankReceivedDate: r.bankReceivedDate ?? "",
      remark: r.remark,
    });
  };

  const handleUpdate = async () => {
    if (!editRecord) return;
    try {
      await updateRecord.mutateAsync({
        id: editRecord.id,
        finance: editForm.finance,
        customerName: editForm.customerName,
        mcf: editForm.mcf,
        product: editForm.product,
        grossAmount: editForm.grossAmount ? Number(editForm.grossAmount) : null,
        netAmount: editForm.netAmount ? Number(editForm.netAmount) : null,
        loanAmount: editForm.loanAmount ? Number(editForm.loanAmount) : null,
        brokerageReceivedDate: editForm.brokerageReceivedDate || null,
        bankReceivedDate: editForm.bankReceivedDate || null,
        remark: editForm.remark,
      });
      toast.success("Record updated!");
      setEditRecord(null);
    } catch {
      toast.error("Failed to update record");
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteRecord.mutateAsync(deleteId);
      toast.success("Record deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete record");
    }
  };

  const handlePrintSingle = (r: BrokerageRecord) => {
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`
      <html><head><title>Brokerage Record #${r.serialNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; color: #1e293b; margin-bottom: 4px; }
        .subtitle { text-align: center; color: #555; margin-bottom: 20px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; }
        td:first-child { font-weight: 600; background: #f8fafc; width: 40%; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .received { background: #dcfce7; color: #166534; }
        .pending { background: #fef9c3; color: #854d0e; }
      </style></head><body>
      <h2>URBAN MONEY BROKERAGE</h2>
      <div class="subtitle">Brokerage Record — #${r.serialNumber}</div>
      <table>
        <tr><td>Serial No.</td><td>#${r.serialNumber}</td></tr>
        <tr><td>Finance</td><td>${r.finance}</td></tr>
        <tr><td>Customer Name</td><td>${r.customerName}</td></tr>
        <tr><td>MCF</td><td>${r.mcf}</td></tr>
        <tr><td>Product</td><td>${r.product}</td></tr>
        <tr><td>Gross Amount</td><td>${fmt(r.grossAmount)}</td></tr>
        <tr><td>Net Amount</td><td>${fmt(r.netAmount)}</td></tr>
        <tr><td>Loan Amount</td><td>${fmt(r.loanAmount)}</td></tr>
        <tr><td>Brokerage Rcv Date</td><td>${r.brokerageReceivedDate || "—"}</td></tr>
        <tr><td>Bank Rcv Date</td><td>${r.bankReceivedDate || "—"}</td></tr>
        <tr><td>Remark</td><td><span class="badge ${r.remark.toLowerCase()}">${r.remark}</span></td></tr>
      </table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const handlePrintAll = () => {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const rows = sorted
      .map(
        (r, i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#f8fafc"}">
        <td>${r.serialNumber}</td>
        <td>${r.brokerageReceivedDate || "—"}</td>
        <td>${r.bankReceivedDate || "—"}</td>
        <td>${r.finance}</td>
        <td>${r.customerName}</td>
        <td>${r.mcf}</td>
        <td>${r.product}</td>
        <td>${fmt(r.loanAmount)}</td>
        <td>${r.grossAmount != null ? `₹${Number(r.grossAmount).toLocaleString("en-IN")}` : "—"}</td>
        <td>${fmt(r.netAmount)}</td>
        <td>${r.remark}</td>
      </tr>
    `,
      )
      .join("");
    const w = window.open("", "_blank", "width=1200,height=700");
    if (!w) return;
    w.document.write(`
      <html><head><title>Brokerage Records</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h2 { text-align: center; color: #1e293b; margin-bottom: 2px; font-size: 20px; }
        .sub { text-align: center; color: #555; font-size: 13px; margin-bottom: 4px; }
        .date { text-align: center; color: #777; font-size: 12px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th { background: #1e293b; color: white; padding: 8px 6px; text-align: left; }
        td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
        .totals td { font-weight: 700; background: #f1f5f9; border-top: 2px solid #1e293b; }
      </style></head><body>
      <h2>URBAN MONEY BROKERAGE</h2>
      <div class="sub">Brokerage Management System — Records Report</div>
      <div class="date">Date: ${today}</div>
      <table>
        <thead><tr>
          <th>Sr. No.</th><th>Brok. Rcv Date</th><th>Bank Rcv Date</th><th>Finance</th>
          <th>Customer Name</th><th>MCF</th><th>Product</th>
          <th>Loan Amt</th><th>Gross Amt</th><th>Net Amt</th><th>Remark</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="totals">
          <td colspan="7" style="text-align:right">TOTALS:</td>
          <td>${totalLoan > 0 ? `₹${totalLoan.toLocaleString("en-IN")}` : "—"}</td>
          <td>${totalGross > 0 ? `₹${totalGross.toLocaleString("en-IN")}` : "—"}</td>
          <td>${totalNet > 0 ? `₹${totalNet.toLocaleString("en-IN")}` : "—"}</td>
          <td></td>
        </tr></tfoot>
      </table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      {/* Page header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            Brokerage Records
          </h2>
          <p className="text-sm text-blue-500 mt-0.5">
            View, manage, and print all brokerage records
          </p>
        </div>
      </div>

      {/* Center title block */}
      <div className="text-center py-4 border-y border-slate-100 mb-4">
        <div
          className="text-xl font-black tracking-wide text-slate-800"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          URBAN MONEY BROKERAGE
        </div>
        <div className="text-sm text-slate-500 mt-1">
          Brokerage Management System — Records Report
        </div>
        <div className="text-xs text-slate-400 mt-0.5">Date: {today}</div>
      </div>

      {/* Filter + Stats row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {(["All", "Received", "Pending"] as Filter[]).map((f) => (
            <button
              type="button"
              key={f}
              data-ocid={`records.filter_${f.toLowerCase()}_button`}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-slate-800 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            Total: <strong>{records.length}</strong> records Received:{" "}
            <strong>{receivedCount}</strong> Pending:{" "}
            <strong className="text-red-500">{pendingCount}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintAll}
            data-ocid="records.print_all_button"
            className="text-slate-700"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print All
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          data-ocid="records.loading_state"
          className="text-center py-12 text-slate-400"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-3" />
          Loading records...
        </div>
      ) : sorted.length === 0 ? (
        <div
          data-ocid="records.empty_state"
          className="text-center py-16 text-slate-400"
        >
          <div className="text-4xl mb-3">📋</div>
          <div className="font-semibold text-slate-600">No records found</div>
          <div className="text-sm mt-1">
            Add a new brokerage record to get started
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table data-ocid="records.table" className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                {[
                  "Sr. No.",
                  "Brok. Rcv Date",
                  "Bank Rcv Date",
                  "Finance",
                  "Customer Name",
                  "MCF",
                  "Product",
                  "Loan Amt",
                  "Gross Amt",
                  "Net Amt",
                  "Remark",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr
                  key={String(r.id)}
                  data-ocid={`records.row.${i + 1}`}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <td className="px-3 py-2.5 font-semibold text-slate-700">
                    #{String(r.serialNumber)}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                    {r.brokerageReceivedDate || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                    {r.bankReceivedDate || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">{r.finance}</td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium">
                    {r.customerName}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{r.mcf}</td>
                  <td className="px-3 py-2.5 text-slate-600">{r.product}</td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {fmt(r.loanAmount)}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {r.grossAmount != null ? (
                      <span>
                        ₹{Number(r.grossAmount).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {fmt(r.netAmount)}
                  </td>
                  <td className="px-3 py-2.5">
                    <RemarkBadge remark={r.remark} />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        data-ocid={`records.edit_button.${i + 1}`}
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        data-ocid={`records.print_button.${i + 1}`}
                        onClick={() => handlePrintSingle(r)}
                        className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Print"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        data-ocid={`records.delete_button.${i + 1}`}
                        onClick={() => setDeleteId(r.id)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td
                  colSpan={7}
                  className="px-3 py-3 text-right font-bold text-slate-700 text-sm"
                >
                  TOTALS
                </td>
                <td className="px-3 py-3 font-bold text-slate-800 text-sm whitespace-nowrap">
                  {totalLoan > 0 ? (
                    <span className="text-slate-800">
                      ₹{totalLoan.toLocaleString("en-IN")}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-3 font-bold text-slate-800 text-sm whitespace-nowrap">
                  {totalGross > 0 ? (
                    <span className="text-slate-800">
                      ₹{totalGross.toLocaleString("en-IN")}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-3 font-bold text-slate-800 text-sm whitespace-nowrap">
                  {totalNet > 0 ? (
                    <span className="text-slate-800">
                      ₹{totalNet.toLocaleString("en-IN")}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td colSpan={2} />
              </tr>
              {/* Labeled totals summary banner */}
              <tr className="bg-slate-800 text-white">
                <td colSpan={12} className="px-4 py-3">
                  <div className="flex flex-wrap gap-6 justify-center text-sm font-semibold">
                    <span>
                      Total Loan Amount:{" "}
                      <span className="text-amber-300">
                        {totalLoan > 0
                          ? `₹${totalLoan.toLocaleString("en-IN")}`
                          : "₹0"}
                      </span>
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>
                      Total Gross Amount:{" "}
                      <span className="text-amber-300">
                        {totalGross > 0
                          ? `₹${totalGross.toLocaleString("en-IN")}`
                          : "₹0"}
                      </span>
                    </span>
                    <span className="text-slate-400">|</span>
                    <span>
                      Total Net Amount:{" "}
                      <span className="text-amber-300">
                        {totalNet > 0
                          ? `₹${totalNet.toLocaleString("en-IN")}`
                          : "₹0"}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editRecord}
        onOpenChange={(o) => !o && setEditRecord(null)}
      >
        <DialogContent
          data-ocid="edit.dialog"
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Edit Brokerage Record</DialogTitle>
            <DialogDescription>
              Update the record details below
            </DialogDescription>
          </DialogHeader>
          {editRecord && (
            <div className="grid grid-cols-2 gap-4 py-2">
              {(
                [
                  ["Finance", "finance", "text"],
                  ["Customer Name", "customerName", "text"],
                  ["MCF", "mcf", "text"],
                  ["Product", "product", "text"],
                  ["Gross Amount", "grossAmount", "number"],
                  ["Net Amount", "netAmount", "number"],
                  ["Loan Amount", "loanAmount", "number"],
                  ["Brokerage Rcv Date", "brokerageReceivedDate", "date"],
                  ["Bank Rcv Date", "bankReceivedDate", "date"],
                ] as [string, string, string][]
              ).map(([label, key, type]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {label}
                  </Label>
                  <Input
                    type={type}
                    value={editForm[key] ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Remark
                </Label>
                <Select
                  value={editForm.remark}
                  onValueChange={(v) =>
                    setEditForm((p) => ({ ...p, remark: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditRecord(null)}
              data-ocid="edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateRecord.isPending}
              data-ocid="edit.save_button"
              className="bg-slate-800 hover:bg-slate-700 text-white"
            >
              {updateRecord.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={deleteId != null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteRecord.isPending}
              data-ocid="delete.confirm_button"
            >
              {deleteRecord.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
