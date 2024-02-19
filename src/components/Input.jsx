export default function Input({ labelText, name, register, errors, rules, placeholder }) {
  return (
    <div className="relative">
      <label htmlFor={name}>
        {labelText}
      </label>
      <input
        id={name}
        name={name}
        className="w-full mb-6 p-2 border rounded"
        type={name}
        placeholder={placeholder}
        {...register(`${name}`, rules)}
      />
      {
        errors[name] && <div className="w-full text-sm text-red-500 absolute top-16">{errors[name].message}</div>
      }
    </div>
  );
}