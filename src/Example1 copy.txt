import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import React, { useState, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([
  AllCommunityModule,
  AllEnterpriseModule
]);

const tradeData =  [
  { country: "USA", assetClass: "Equity", assetType: "Stock", sector: "Tech", region: "North", price: 500, volume: 100 },
  { country: "USA", assetClass: "Equity", assetType: "ETF", sector: "Finance", region: "North", price: 200, volume: 50 },
  { country: "UK", assetClass: "Fixed Income", assetType: "Bond", sector: "Finance", region: "Europe", price: 300, volume: 80 }
];

const processedData = tradeData.flatMap((row) => [
  { ...row, group1: `${row.country} → ${row.assetClass} → ${row.assetType}`, group2: "" },
  { ...row, group1: "", group2: `${row.sector} → ${row.country}` }
]);
// Column definitions for asymmetric grouping

const AsymmetricGroupingGrid = () => {
  const gridRef = useRef<any>(null);
  const columnDefs = [
    { field: "country", rowGroup: true, hide: true },  
    { field: "assetClass", rowGroup: true, hide: true },  
    { field: "assetType", rowGroup: true, hide: true },  
    { field: "sector" },  
    { field: "region" },  
    { field: "price", aggFunc: "sum" },  
    { field: "volume", aggFunc: "sum" }  
  ];
  const autoGroupColumnDef = {
    headerName: "Group",
    minWidth: 300,
    cellRendererParams: {
      suppressCount: false,  // Show count in the group
    },
  };
  const gridOptions = {
    theme: "quartz",
    
    groupDisplayType: "groupRows",
    animateRows: true,
    columnDefs,
    rowData: processedData,
    // groupDisplayType: "multipleColumns", // Groups only in the first column
    // columnDefs,
    // rowData: tradeData, // Your trade data
    // animateRows: true,
    
    
    autoGroupColumnDef,
    suppressRowClickSelection: true,
    groupIncludeTotalFooter: true, // Show totals for each group
  };
  

  // Expand/Collapse groups
  const onExpandAll = useCallback(() => {
    gridRef.current.api.expandAll();
  }, []);

  const onCollapseAll = useCallback(() => {
    gridRef.current.api.collapseAll();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h3>Ag-Grid: Asymmetric Grouping</h3>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={onExpandAll} style={{ marginRight: "5px" }}>Expand All</button>
        <button onClick={onCollapseAll}>Collapse All</button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: "80vw" }}>
        <AgGridReact
          ref={gridRef}
          {...gridOptions}
          animateRows={true}
          
        />
      </div>
    </div>
  );
};

export default AsymmetricGroupingGrid;
