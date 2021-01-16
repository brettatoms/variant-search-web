import React, { useEffect, useState } from "react";
import {
  EuiAccordion,
  EuiBasicTable,
  EuiLink,
  EuiTableFieldDataColumnType,
  EuiText,
  Direction,
  Criteria,
} from "@elastic/eui";
import { GeneDetail, details as getGeneDetails } from "./api";

interface Props {
  gene: string;
}

const columnSettings: Record<
  string,
  EuiTableFieldDataColumnType<GeneDetail>
> = {
  gene: {
    field: "gene",
    name: "GENE",
    sortable: true,
  },
  nucleotide_change: {
    field: "nucleotide_change",
    name: "NUCLEOTIDE CHANGE",
    sortable: true,
    render: (value, item) => (
      <EuiAccordion
        id="accordion1"
        buttonContent={<EuiText size={"s"}>{value}</EuiText>}
        paddingSize="l"
      >
        {item.other_mappings.split(",").map((m: string) => (
          <EuiText size={"s"}>{m}</EuiText>
        ))}
      </EuiAccordion>
    ),
  },
  protein_change: {
    field: "protein_change",
    name: "PROTEIN CHANGE",
    sortable: true,
  },
  alias: {
    field: "alias",
    name: "ALIAS",
    sortable: true,
  },
  region: {
    field: "region",
    name: "REGION",
    sortable: true,
  },
  reported_classification: {
    field: "reported_classification",
    name: "REPORTED CLASSIFICATION",
    sortable: true,
  },
  last_evaluated: {
    field: "last_evaluated",
    name: "LAST EVALUATED",
    sortable: true,
  },
  last_updated: {
    field: "last_updated",
    name: "LAST UPDATED",
    sortable: true,
  },
  more_info: {
    field: "more_info",
    name: "MORE INFO",
    sortable: true,
    render: (_, item) => (
      <EuiLink href={item.url} target="_blank">
        {item.source}
      </EuiLink>
    ),
  },
};

export const DataTable: React.FC<Props> = ({ gene }) => {
  const [data, setData] = useState<GeneDetail[]>([]);
  const [columns, setColumns] = useState<
    EuiTableFieldDataColumnType<GeneDetail>[]
  >([]);
  const [sortField, setSortField] = useState("gene");
  const [sortDirection, setSortDirection] = useState<Direction>("asc");

  useEffect(() => {
    getGeneDetails(gene).then((d) => {
      setData(d);
      const cols = Object.keys(d[0])
        // only use columns in columnSettings
        .filter((k) => k in columnSettings)
        .map((key) => columnSettings[key]);
      cols.push(columnSettings["more_info"]);
      setColumns(cols);
    });
  }, [gene]);

  const onChange = ({ sort }: Criteria<GeneDetail>) => {
    if (!sort) {
      return;
    }
    const { field: sortField, direction: sortDirection } = sort;
    setSortField(sortField);
    setSortDirection(sortDirection);
    if (data) {
      setData((data) =>
        data.sort((left, right) =>
          sortDirection === "asc"
            ? right[sortField].localeCompare(left[sortField])
            : left[sortField].localeCompare(right[sortField])
        )
      );
    }
  };

  const sorting = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  return (
    <EuiBasicTable
      columns={columns}
      isExpandable
      isSelectable
      items={data}
      onChange={onChange}
      responsive
      sorting={sorting}
      tableLayout="auto"
    />
  );
};
