import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import useNuiEvent from '../../hooks/useNuiEvent';
import useQueue from '../../hooks/useQueue';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import Fade from './transitions/Fade';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: any;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotification = React.forwardRef(
  (
    props: { item: ItemNotificationProps; style?: React.CSSProperties },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const slotItem = props.item.item;
    const isAdd = props.item.text.text === 'ui_added';

    const className = isAdd
      ? 'item-notification-item'
      : 'item-red_notification-item';

    const sign = isAdd ? '+' : '-';
    const label = slotItem.metadata?.label || Items[slotItem.name]?.label || '';
    const imgSrc = getItemUrl(slotItem) || '';

    return (
      <div ref={ref} className={className} style={props.style} aria-live="polite">
        <div className="icon" aria-hidden="true">{sign}</div>

        <div className="notification-info">
          <p>{props.item.text.count}</p>
          <div>{label}</div>
        </div>

        {imgSrc ? (
          <img src={imgSrc} alt={label} />
        ) : (
          <div aria-hidden="true" style={{ width: '1.5vw', height: '1.5vw' }} />
        )}
      </div>
    );
  }
);


export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useQueue<{
    id: number;
    item: ItemNotificationProps;
    ref: React.RefObject<HTMLDivElement>;
  }>();

  const add = (item: ItemNotificationProps) => {
    const ref = React.createRef<HTMLDivElement>();
    const notification = { id: Date.now(), item, ref: ref };

    queue.add(notification);

    const timeout = setTimeout(() => {
      queue.remove();
      clearTimeout(timeout);
    }, 2500);
  };

  useNuiEvent<[item: SlotWithItem, text: any, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: {count: count ? `${count}x` : `0x`, text: text} });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <TransitionGroup className="item-notification-container">
          {queue.values.map((notification, index) => (
            <Fade key={`item-notification-${index}`}>
              <ItemNotification item={notification.item} ref={notification.ref} />
            </Fade>
          ))}
        </TransitionGroup>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
