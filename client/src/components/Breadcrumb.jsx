import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { Link } from "react-router";

export default function Breadcrumbs({ crumbs }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((item, index) => (
          <Fragment key={item.href}>
            <BreadcrumbItem key={item.href}>
              {index === crumbs.length - 1 ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild={true}>
                  <Link to={item.href}>{item.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
