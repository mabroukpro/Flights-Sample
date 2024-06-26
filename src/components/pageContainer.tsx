import classNames from "classnames";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  centeredTitle?: boolean;
  className?: string;
}

function PageContainer({
  children,
  title,
  className,
  centeredTitle = false,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={classNames(
        "tw-min-h-svh tw-mt-[-64px] tw-pt-20 tw-flex tw-flex-col tw-gap-4 tw-p-6",
        className
      )}
      {...props}
    >
      {title && (
        <h1
          className={classNames("tw-text-4xl", {
            "tw-text-center": centeredTitle,
          })}
        >
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}

export default PageContainer;
