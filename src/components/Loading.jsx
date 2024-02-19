import ReactLoading from 'react-loading';
 
const Loading = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={'100px'} width={'100px'} />
);
 
export default Loading;