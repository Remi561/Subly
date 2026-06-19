import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export function formatMoney(amountInMinorUnit, currency) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format((amountInMinorUnit || 0 )/ 100);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCategory(category) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatBillingCycle(cycle) {
  return cycle.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCategoryDotClass(category) {
  const styles = {
    ENTERTAINMENT: "bg-subly-brand-purple",
    PRODUCTIVITY: "bg-subly-success",
    STORAGE: "bg-subly-brand-blue",
    AI_TOOLS: "bg-subly-warning",
  };

  return styles[category] || "bg-subly-text-secondary";
}

export function getCategoryTextClass(category) {
  const styles = {
    ENTERTAINMENT: "text-subly-brand-purple",
    PRODUCTIVITY: "text-subly-success",
    STORAGE: "text-subly-brand-blue",
    AI_TOOLS: "text-subly-warning",
  };

  return styles[category] || "text-subly-text-secondary";
}

export function getStatusBadgeClass(status) {
  const styles = {
    ACTIVE: "border-green-100 bg-green-50 text-subly-success",
    EXPIRED: "border-red-100 bg-red-50 text-subly-danger",
    ARCHIVED:
      "border-subly-border bg-subly-background text-subly-text-secondary",
    CANCELLED:
      "border-subly-border bg-subly-background text-subly-text-secondary",
  };

  return styles[status] || styles.ARCHIVED;
}

export function getCategoryStyle(category) {
  const styles = {
    ENTERTAINMENT: {
      dot: "bg-subly-brand-blue",
      text: "text-subly-brand-blue",
    },
    PRODUCTIVITY: {
      dot: "bg-subly-brand-purple",
      text: "text-subly-brand-purple",
    },
    STORAGE: {
      dot: "bg-subly-warning",
      text: "text-subly-warning",
    },
    AI_TOOLS: {
      dot: "bg-subly-success",
      text: "text-subly-success",
    },
  };

  return (
    styles[category] || {
      dot: "bg-subly-text-secondary",
      text: "text-subly-text-secondary",
    }
  );
}


export function getRenewalTextClass(daysLeft, status) {
  if (status === "EXPIRED") return "text-subly-danger";
  if (status === "ARCHIVED") return "text-subly-text-secondary";
  if (daysLeft <= 7) return "text-subly-warning";

  return "text-subly-text-secondary";
}

export function getRenewalText(subscription) {
  if (subscription.status === "EXPIRED") return "Expired";
  if (subscription.status === "ARCHIVED") return "Archived";

  return `Renews in ${subscription.daysLeft} days`;
}



export function getStatusStyle(status) {
  const styles = {
    ACTIVE: "bg-green-50 text-subly-success border-green-100",
    EXPIRED: "bg-red-50 text-subly-danger border-red-100",
    ARCHIVED: "bg-slate-100 text-subly-text-secondary border-subly-border",
    CANCELLED: "bg-slate-100 text-subly-text-secondary border-subly-border",
  };

  return styles[status] || styles.ARCHIVED;
}

async function extractErrorMessage(response) {
  try {
    // Clone the response so we don't lock the readable stream
    const clonedResponse = response.clone();

    // Try to parse it as JSON first
    const data = await clonedResponse.json();

    // Adjust these keys based on what your Express backend actually sends!
    // (e.g., res.status(400).json({ message: "..." }) or { error: "..." })
    return data.message || data.error || "Something went wrong";
  } catch{
    // If it's not JSON (like an Nginx 502 HTML page), fallback to generic error
    return "An unexpected server error occurred";
  }
}

let refreshPromise = null;

export async function fetchWithAuth(url, options = {}) {
  try {
    let response = await fetch(url, {
      ...options,
      credentials: "include", // Include cookies for authentication
    });

    if (response.status === 401) {
      if (!refreshPromise) {
        refreshPromise = fetch("/api/refresh", {
          method: "POST",
          credentials: "include",
        }).finally(() => {
          refreshPromise = null
        });
      }

      const refreshResponse = await refreshPromise;

      if (!refreshResponse.ok) {
        const serverMessage = await extractErrorMessage(response);
        throw new Error(serverMessage);

      }

      response = await fetch(url, {
        ...options,
        credentials: "include",
      });

      if (!response.ok) {
        const serverMessage = await extractErrorMessage(response);
        throw new Error(serverMessage);
      }
      
    }
    else if (!response.ok) {
      const serverMessage = await extractErrorMessage(response);
      throw new Error(serverMessage);
    }
    return response
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err; // Rethrow the error to be handled by the caller
  }
}

export const generatePaginationRange = (currentPage, totalPages) => {
  const siblingCount = 1; // Number of pages to show on either side of current page
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    // Always include first page, last page, and pages within the sibling range
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - siblingCount && i <= currentPage + siblingCount)
    ) {
      pages.push(i);
    }
    // Add ellipsis placeholder strings exactly where the gaps occur
    else if (
      i === currentPage - siblingCount - 1 ||
      i === currentPage + siblingCount + 1
    ) {
      pages.push("...");
    }
  }

  // Filter out any accidental duplicate consecutive ellipses
  return pages.filter(
    (item, index, arr) => item !== "..." || arr[index - 1] !== "...",
  );
};
