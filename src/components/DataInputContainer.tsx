import './DataInputContainer.css';
import { handleSubmit } from '../handles/handlesubmit';
import { useRef } from 'react';


interface ContainerProps {
  name: string;
}

const DataInputContainer: React.FC<ContainerProps> = ({ name }) => {
  const dataRef = useRef<HTMLInputElement>(null);

 
  const submithandler = (e) => {
    e.preventDefault();
    if (dataRef.current) {
      handleSubmit(dataRef.current.value);
      dataRef.current.value = "";
    }
  };
  
  return (
    <div className="App">
      <form onSubmit={submithandler}>
        <input type= "text" ref={dataRef} />
        <button type = "submit">Save</button>
      </form>
    </div>
  );
};

export default DataInputContainer;
