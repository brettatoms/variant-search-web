import React, { useCallback, useState } from "react";
import { EuiComboBox } from "@elastic/eui";
import { list as listGenes } from "./api";

interface Props {
  onChange: (id: string | null) => void;
}

type Option = {
  label: string;
};

export const SearchBox: React.FC<Props> = ({ onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const onSearchChange = useCallback(async (query) => {
    if (query.length < 1) {
      setOptions([]);
      return;
    }

    setIsLoading(true);
    try {
      const genes = await listGenes(query);
      setOptions(genes.map((g: string) => ({ label: g })));
    } catch (e) {
      // TODO: handle errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (selected: Option[]) => {
    setSelectedOptions(selected);
    if (selected.length) {
      onChange(selected[0].label);
    } else {
      onChange(null);
    }
  };

  return (
    <EuiComboBox
      async
      isLoading={isLoading}
      onChange={handleChange}
      onSearchChange={onSearchChange}
      options={options}
      placeholder={"Search"}
      selectedOptions={selectedOptions}
      singleSelection={{ asPlainText: true }}
    />
  );
};
