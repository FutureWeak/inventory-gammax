import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import shape from "../../assets/shape.png";

const PAGE_SIZE = 30;

const RightInventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  if (inventory.type && inventory.label){
  return (
    <>
    {/* <div className='inventory-grid'>
      <img className='sidebar' src={sideshape} alt="" /> */}
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper">

            <div className='label-container'>
              <img src={shape} alt="" />
              <h1>{inventory.label}</h1>
            </div>
            


            {inventory.maxWeight && (

              <div className='weight-container'> 
              <p>
                {weight / 1000}/{inventory.maxWeight / 1000}kg
              </p>

              <div style={{display: 'flex',alignItems:'center',justifyContent:'center'}}>
              <div className='weight-circle-text'>{Math.floor(100 * (weight / inventory.maxWeight))}</div>
               <svg className="weight-circle">
            <circle
              cx="25px"
              cy="25px"
              r="20px"
              fill="transparent"
              stroke="#323C16"
              stroke-width="5px"
            />

            <circle
            className='value'
            style={{strokeDashoffset:  ( 300 - ((weight / inventory.maxWeight) * 310) / 1.26) + "%",}}
              cx="25px"
              cy="25px"
              r="20px"
              fill="transparent"
              stroke="#D0F568"
              stroke-width="5px"
            />
          </svg>
              </div>
              </div>
            )}
          </div>

        </div>
        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </>
        </div>


         
      </div>
         
    </>
  );
}else{
  return (
    <></>
  )
}
};

export default RightInventoryGrid;
