"use client"

import { DataTable } from '@/components/data-table';
import { DataTableHead, HeadCell } from '@/components/data-table-head';
import { SearchInput } from '@/components/search-input';
import { LanguagesMenu } from '@/components/translations/languages-menu';
import { NamespaceTableRow } from '@/components/translations/namespace/namespace-table-row';
import { useSearch } from '@/hooks/useSearch';
import { SelectChangeEvent, Card, Box, FormControl, InputLabel, Select, MenuItem, TableBody } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, type FC } from 'react'
import { useListLanguagesQuery, useSearchNamespacesQuery } from './api-calls-hooks';
import { useRouter } from 'next/navigation';

interface TranslationsTableProps {

}

const headCells: HeadCell[] = [
  {
    id: "name",
    label: "Namespace",
  },
];

const statusOptions = [
  {
    label: "Namespaces",
    value: "namespaces",
  },
  {
    label: "Translations",
    value: "translations",
  },
];

export const TranslationsTable: FC<TranslationsTableProps> = (props) => {
  const { query } = useRouter();

  const [keyword, handleKeywordChange, handleSearch] =
    useSearch();
  const { data: languages } = useListLanguagesQuery();
  const { data: namespacesData } = useSearchNamespacesQuery();

  const [selectedLanguageCodes, setSelectedLanguageCodes] = useState(() => {
    if (query?.language) {
      if (typeof query.language === "string") {
        return [query.language];
      }

      return query.language;
    }

    if (languages) {
      return languages.map((language) => language.code);
    }

    return [];
  });
  const [searchFor, setSearchFor] = useState(
    (query?.searchFor as string) || "namespaces"
  );
  const shownLanguageCodes = (() => {
    if (query?.language) {
      if (typeof query.language === "string") {
        return [query.language];
      }

      return query.language;
    }

    if (languages) {
      return languages.map((language) => language.code);
    }

    return [];
  })();

  if (!namespacesData || !languages) return null;

  const shownLanguages = languages?.filter((language) =>
    shownLanguageCodes?.includes(language.code)
  );

  const { namespaces, count } = namespacesData;

  const handleSelectLanguage = (_: any, languageCode: string) => {
    if (selectedLanguageCodes.includes(languageCode)) {
      setSelectedLanguageCodes(
        selectedLanguageCodes.filter((code) => code !== languageCode)
      );
      return;
    }

    setSelectedLanguageCodes([...selectedLanguageCodes, languageCode]);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    setSearchFor(event.target.value);
  };

  return (
    <>
      <Card>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              sm: "1fr 240px 160px",
            },
            p: 2,
          }}
        >
          <form
            onSubmit={(event) => {
              handleSearch(event, {
                searchFor,
                language: selectedLanguageCodes,
              });
            }}
          >
            <SearchInput
              onChange={handleKeywordChange}
              placeholder="Search..."
              value={keyword}
            />
          </form>
          <FormControl>
            <InputLabel id="status">Search for</InputLabel>
            <Select
              id="status"
              label="Search for"
              onChange={handleStatusChange}
              value={searchFor}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LanguagesMenu
            languages={languages}
            selectedLanguageCodes={selectedLanguageCodes}
            onSelect={handleSelectLanguage}
          />
        </Box>
        <DataTable count={count}>
          <DataTableHead headCells={headCells} />
          <TableBody>
            {namespaces?.map((namespace) => (
              <NamespaceTableRow
                languages={languages}
                namespace={namespace}
                key={namespace.name}
                shownLanguages={shownLanguages}
              />
            ))}
          </TableBody>
        </DataTable>
      </Card>
    </>
  )
};
