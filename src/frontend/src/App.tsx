import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { AddBrokerageForm } from "./components/AddBrokerageForm";
import { AllRecordsTable } from "./components/AllRecordsTable";
import { useGetRecordCount } from "./hooks/useQueries";

const queryClient = new QueryClient();

type Tab = "add" | "records";

function AppInner() {
  const [tab, setTab] = useState<Tab>("add");
  const { data: count } = useGetRecordCount();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1
                className="text-xl font-black tracking-tight leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Urban Money Brokerage
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Financial Records Management System
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-black text-amber-400"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              {count != null ? String(count) : "0"}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">
              Total Records
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-0 flex gap-2">
          <button
            type="button"
            data-ocid="nav.add_button"
            onClick={() => setTab("add")}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
              tab === "add"
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Add New Brokerage
          </button>
          <button
            type="button"
            data-ocid="nav.records_button"
            onClick={() => setTab("records")}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
              tab === "records"
                ? "bg-white text-slate-900"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <List className="h-4 w-4" />
            All Records
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        className={`w-full flex-1 ${
          tab === "records"
            ? "px-2 sm:px-4 py-4"
            : "max-w-7xl mx-auto px-4 sm:px-6 py-6"
        }`}
      >
        {tab === "add" ? <AddBrokerageForm /> : <AllRecordsTable />}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 no-print">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-slate-600"
        >
          caffeine.ai
        </a>
      </footer>

      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
