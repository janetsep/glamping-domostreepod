
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/react-query";
import { router } from "@/Router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {router}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
