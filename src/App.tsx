import React, { useState } from "react";
import "./App.css";
import "@elastic/eui/dist/eui_theme_light.css";

import { EuiFlexItem, EuiFlexGroup, EuiPage } from "@elastic/eui";
import { SearchBox } from "./SearchBox";
import { DataTable } from "./DataTable";

function App() {
  const [gene, setGene] = useState<string | null>(null);

  return (
    <EuiPage>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <SearchBox onChange={setGene} />
        </EuiFlexItem>
        <EuiFlexItem>{gene && <DataTable gene={gene} />}</EuiFlexItem>
      </EuiFlexGroup>
    </EuiPage>
  );
}

export default App;
