import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Printer, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddRecord, useGetNextSerial } from "../hooks/useQueries";

const emptyForm = {
  finance: "",
  customerName: "",
  mcf: "",
  product: "",
  grossAmount: "",
  netAmount: "",
  loanAmount: "",
  brokerageReceivedDate: "",
  bankReceivedDate: "",
  remark: "Received",
};

export function AddBrokerageForm() {
  const [form, setForm] = useState({ ...emptyForm });
  const { data: nextSerial } = useGetNextSerial();
  const addRecord = useAddRecord();

  const serialDisplay = nextSerial ? `#${nextSerial.toString()}` : "#1";

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleClear = () => setForm({ ...emptyForm });

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`
      <html><head><title>Brokerage Record Preview</title>
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
      </style>
      </head><body>
      <h2>URBAN MONEY BROKERAGE</h2>
      <div class="subtitle">Brokerage Record — ${serialDisplay}</div>
      <table>
        <tr><td>Finance</td><td>${form.finance || "—"}</td></tr>
        <tr><td>Customer Name</td><td>${form.customerName || "—"}</td></tr>
        <tr><td>MCF</td><td>${form.mcf || "—"}</td></tr>
        <tr><td>Product</td><td>${form.product || "—"}</td></tr>
        <tr><td>Gross Amount</td><td>${form.grossAmount ? `₹${Number(form.grossAmount).toLocaleString("en-IN")}` : "—"}</td></tr>
        <tr><td>Net Amount</td><td>${form.netAmount ? `₹${Number(form.netAmount).toLocaleString("en-IN")}` : "—"}</td></tr>
        <tr><td>Loan Amount</td><td>${form.loanAmount ? `₹${Number(form.loanAmount).toLocaleString("en-IN")}` : "—"}</td></tr>
        <tr><td>Brokerage Rcv Date</td><td>${form.brokerageReceivedDate || "—"}</td></tr>
        <tr><td>Bank Rcv Date</td><td>${form.bankReceivedDate || "—"}</td></tr>
        <tr><td>Remark</td><td><span class="badge ${form.remark.toLowerCase()}">${form.remark}</span></td></tr>
      </table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.finance || !form.customerName || !form.mcf || !form.product) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addRecord.mutateAsync({
        finance: form.finance,
        customerName: form.customerName,
        mcf: form.mcf,
        product: form.product,
        grossAmount: form.grossAmount ? Number(form.grossAmount) : null,
        netAmount: form.netAmount ? Number(form.netAmount) : null,
        loanAmount: form.loanAmount ? Number(form.loanAmount) : null,
        brokerageReceivedDate: form.brokerageReceivedDate || null,
        bankReceivedDate: form.bankReceivedDate || null,
        remark: form.remark,
      });
      toast.success("Record saved successfully!");
      handleClear();
    } catch {
      toast.error("Failed to save record");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      {/* Form header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            New Brokerage Entry
          </h2>
          <p className="text-sm text-blue-500 mt-0.5">
            Fill in the details to create a new brokerage record
          </p>
        </div>
        <span className="bg-slate-100 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">
          S/N: {serialDisplay}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Serial Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Serial Number
            </Label>
            <Input
              data-ocid="form.serial_input"
              value={`Auto-assigned: ${serialDisplay}`}
              disabled
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Finance */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Finance <span className="text-red-500">*</span>
            </Label>
            <Input
              data-ocid="form.finance_input"
              value={form.finance}
              onChange={(e) => set("finance", e.target.value)}
              placeholder="Enter finance company"
            />
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Customer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              data-ocid="form.customer_input"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          {/* MCF */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              MCF <span className="text-red-500">*</span>
            </Label>
            <Input
              data-ocid="form.mcf_input"
              value={form.mcf}
              onChange={(e) => set("mcf", e.target.value)}
              placeholder="Enter MCF number"
            />
          </div>

          {/* Product */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product <span className="text-red-500">*</span>
            </Label>
            <Input
              data-ocid="form.product_input"
              value={form.product}
              onChange={(e) => set("product", e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          {/* Gross Amount */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gross Amount
            </Label>
            <Input
              data-ocid="form.gross_input"
              type="number"
              value={form.grossAmount}
              onChange={(e) => set("grossAmount", e.target.value)}
              placeholder="Enter gross amount"
            />
          </div>

          {/* Net Amount */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Amount
            </Label>
            <Input
              data-ocid="form.net_input"
              type="number"
              value={form.netAmount}
              onChange={(e) => set("netAmount", e.target.value)}
              placeholder="Enter net amount"
            />
          </div>

          {/* Loan Amount */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Loan Amount (Optional)
            </Label>
            <Input
              data-ocid="form.loan_input"
              type="number"
              value={form.loanAmount}
              onChange={(e) => set("loanAmount", e.target.value)}
              placeholder="Enter loan amount"
            />
          </div>

          {/* Brokerage Received Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Brokerage Amt. Received Date (Optional)
            </Label>
            <Input
              data-ocid="form.brok_date_input"
              type="date"
              value={form.brokerageReceivedDate}
              onChange={(e) => set("brokerageReceivedDate", e.target.value)}
            />
          </div>

          {/* Bank Received Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bank Amt. Received Date (Optional)
            </Label>
            <Input
              data-ocid="form.bank_date_input"
              type="date"
              value={form.bankReceivedDate}
              onChange={(e) => set("bankReceivedDate", e.target.value)}
            />
          </div>

          {/* Remark - full width */}
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Remark
            </Label>
            <Select value={form.remark} onValueChange={(v) => set("remark", v)}>
              <SelectTrigger data-ocid="form.remark_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            data-ocid="form.clear_button"
          >
            <X className="h-4 w-4 mr-1.5" />
            Clear
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            data-ocid="form.print_button"
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Print
          </Button>
          <Button
            type="submit"
            disabled={addRecord.isPending}
            data-ocid="form.submit_button"
            className="bg-slate-800 hover:bg-slate-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {addRecord.isPending ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}
