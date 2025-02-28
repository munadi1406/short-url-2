import { ArrowUp, ArrowDown } from "lucide-react";

const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toLocaleString();
};

const Indicator = ({ title, value, comprisonsValue = 0 }) => {
    const isPositive = parseFloat(comprisonsValue) > 0;
    const isNegative = parseFloat(comprisonsValue) < 0;

    return (
        <div className='w-full border rounded-md grid grid-cols-2 '>
            <p className="text-md  text-gray-700 p-2 my-auto">{title} :</p>
            <p className="text-md font-semibold text-gray-700 p-2 flex flex-col justify-center items-center">
                {formatNumber(value)}
                {comprisonsValue != 0 && (
                    <span className="flex items-center text-xs font-semibold justify-center mx-4">
                        {comprisonsValue}
                        {isPositive && <ArrowUp className="text-green-500 ml-1" size={16} />}
                        {isNegative && <ArrowDown className="text-red-500 ml-1" size={16} />}
                    </span>
                )}
            </p>
        </div>
    );
};

export default Indicator;
