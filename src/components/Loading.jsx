import ReactLoading from 'react-loading';
 
const Loading = ({ type, color, height, width }) => (
    <ReactLoading type={type} color={color} height={height || "100px"} width={width || "100px"} />
);
 
export default Loading;