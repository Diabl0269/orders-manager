import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from 'react';
import { View } from 'react-native';
import { shouldBeOverridden } from './utils';

interface Props {
  children: ReactNode;
}

type SetViewValues = (
  view: View | null | undefined,
  callback: Function,
  id: number
) => void;

interface DropZoneValue {
  x: [left: number, right: number];
  y: [top: number, bottom: number];
  hovered: boolean;
}

interface Context {
  dropZoneValues: Array<DropZoneValue>;
  setDropZoneValues: Dispatch<SetStateAction<Array<DropZoneValue>>>;
  setViewValues: SetViewValues;
}

const initContext: Context = {
  dropZoneValues: [],
  setDropZoneValues: shouldBeOverridden,
  setViewValues: shouldBeOverridden
};

const setViewValues: SetViewValues = (view, callback, id) =>
  view &&
  view.measure((x, y, width, height, pageX, pageY) => {
    callback(id, { x, y, width, height, pageX, pageY });
  });

  const ScreenContext = createContext(initContext);
const ScreenProvider = (props: Props) => {
  const { children } = props;
  const [dropZoneValues, setDropZoneValues] = useState<Array<DropZoneValue>>(
    []
  );

  return (
    <ScreenContext.Provider
      value={{
        dropZoneValues,
        setViewValues,
        setDropZoneValues
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};

const useScreen = () => useContext(ScreenContext);

export { ScreenProvider, useScreen };
