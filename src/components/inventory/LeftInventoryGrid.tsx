import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppDispatch, useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import shape from "../../assets/shape.png";
import { fetchNui } from '../../utils/fetchNui';
import UsefulControls from './UsefulControls';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import Fade from '../utils/transitions/Fade';

const PAGE_SIZE = 30;

const LeftInventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
    const [infoVisible, setInfoVisible] = useState(false);
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

    const itemAmount = useAppSelector(selectItemAmount);
    const dispatch = useAppDispatch();
  
  
  
  
    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.valueAsNumber =
        isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
      dispatch(setItemAmount(event.target.valueAsNumber));
    };


  return (
    <>
    <div className='inventory-grid'>
       {/*<img className='sidebar' src={sideshape} alt="" /> */}

      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>

        <div>
          <div className="inventory-grid-header-wrapper">

            <div className='label-container'>
              <img src={shape} alt="" />
              <h1>INVENTARIO</h1>
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
            {inventory.items.slice(5, (page + 1) * PAGE_SIZE).map((item, index) => (
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

        <div className='line'></div>

          <div  className="singlerow inventory-grid-container" ref={containerRef}>
          <>
            {inventory.items.slice(0, 5).map((item, index) => (
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
        <div className='actions'>
          <div style={{  width: '2vw'}} onClick={() => fetchNui('exit')}>X</div>
                    <input
            className="inventory-control-input s"
            placeholder='0'
            type="number"
            defaultValue={0}
            onChange={inputHandler}
            min={0}
            style={{clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)'}}
          />

 
          </div> 
    </div>

    
    {/* <Fade in={infoVisible}>
      <div className="inventory-control">
            <div>

       
          <input
            className="inventory-control-input s"
            placeholder='amount'
            type="number"
            defaultValue={'amount'}
            onChange={inputHandler}
            min={0}
          />

          <div onClick={() => setInfoVisible(false)} className='inventory-control-input'>CONFIRM</div>
</div>
      </div>
      </Fade> */}

     <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
    </>
  );
};

export default LeftInventoryGrid;
