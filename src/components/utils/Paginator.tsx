import Alert from "../utils/Alert";
import Spinner from "../utils/Spinner";
import ArrowLeftIcon from "../icons/ArrowLeftIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import Button from "./Button";
import { JSX } from "react";

/**
 * @interface PaginatorProps
 * @description The props for the Paginator component
 */
interface PaginatorProps {
    slot: JSX.Element;
    nextPage: () => void;
    previousPage: () => void;
    isLoading: boolean;
    error: string | null | unknown;
    page: number | null | unknown;
    pages: number | null | unknown;
}

/**
 * @function Paginator
 * @param {PaginatorProps} props
 * @returns {JSX.Element}
 */
const Paginator = (props: PaginatorProps): JSX.Element => {
    const { slot, nextPage, previousPage, isLoading, error, page, pages } = props;

    const previousPageHandler = () => {
        previousPage();
    };

    const nextPageHandler = () => {
        nextPage();
    }

    return (
        <div>
            <Alert message={error} type="error" />

            {!isLoading && !error && <div>{slot}</div>}

            {isLoading &&
                <div className="w-full flex items-center justify-center p-3">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} width="2em" fill="white" />
                        <p className="text-white">Loading...</p>
                    </div>
                </div>
            }

            {!isLoading &&
                <div>
                    <div className="flex gap-2 mt-2">
                        <Button type="primary" onClick={previousPageHandler} slot={<ArrowLeftIcon fill="white" width=".6em" />} display="w-10 p-2 flex items-center justify-center" disabled={page === 1} />
                        <Button type="primary" onClick={nextPageHandler} slot={<ArrowRightIcon fill="white" width=".6em" />} display="w-10 p-2 flex items-center justify-center" disabled={page === pages} />
                        <div className="w-full h-full flex items-center justify-center p-2 bg-gray-500 rounded-md text-xs">
                            Page {String(page || 1)} of {String(pages || 1)}
                        </div>
                    </div>

                </div>
            }
        </div>
    );
};

export default Paginator;
