import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from "./ui/breadcrumb";
import { Link } from "react-router";


export default function Breadcrumbs({crumbs}) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((item, index) => (
            <BreadcrumbItem
              key={item.href}
          
            >
              {index === crumbs.length - 1 ? (
                <BreadcrumbPage>
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild={true}>
                  <Link to={item.href}>{item.name}</Link>
                </BreadcrumbLink>
              )}
              {index < crumbs.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
};