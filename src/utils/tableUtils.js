// for calculating left position of each pinned column
export const getPinnedColumnLeftPositions = (pinnedColumns, pinnedColumnsRef, defaultLeft = 54) => {
    let columnLeftValues = {};
    pinnedColumns.forEach(columnKey => {
        const columnIndex = pinnedColumns.indexOf(columnKey);
        const leftColumns = pinnedColumns.slice(0, columnIndex);
        let leftColumnsWidth = 0;
        leftColumns.forEach(id => {
            const columnElement = pinnedColumnsRef?.[id];
            if (columnElement) {
                leftColumnsWidth += columnElement.offsetWidth;
            }
        });
        columnLeftValues[columnKey] = `${leftColumnsWidth + defaultLeft}px`;
    });
    return columnLeftValues;
};
