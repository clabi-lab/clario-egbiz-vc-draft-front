import { useFilterStore } from "@/store/useFilterStore";

import { Chip, Stack } from "@mui/material";

const FiltersView = () => {
  const filterTags = useFilterStore((state) => state.filterTags);

  return (
    <Stack
      spacing={{ xs: 1, sm: 1 }}
      direction="row"
      useFlexGap
      className="mt-4 w-full"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        maxHeight: "150px",
        overflowX: "auto",
      }}
    >
      {filterTags.length > 0 &&
        filterTags.slice(0, 17).map((tag, index) => (
          <Chip
            label={tag}
            key={`${tag}_${index}`}
            sx={{
              backgroundColor: "var(--tag-bg)",
              color: "var(--tag-text)",
              borderRadius: "8px",
              px: 0.75,
              py: 0.5,
              height: "auto",
              width: "calc(16% - 3px)",
              "& .MuiChip-label": {
                display: "block",
                whiteSpace: "nowrap",
              },
            }}
          />
        ))}
      {filterTags.length > 17 && (
        <Chip
          label={`외 ${filterTags.length - 17}개`}
          sx={{
            backgroundColor: "#7EBAEB",
            color: "var(--tag-text)",
            borderRadius: "8px",
            px: 0.75,
            py: 0.5,
            height: "auto",
            width: "calc(16% - 3px)",
            "& .MuiChip-label": {
              display: "block",
              whiteSpace: "normal",
            },
          }}
        />
      )}
    </Stack>
  );
};

export default FiltersView;
