import { client } from 'client';
import Link from 'next/link';
import React from 'react';
/**
 * A navigation menu component.
 * @param {Props} props The props object.
 * @param {string} props.menuLocation A matching menu location string that can be used to query from WP GraphQL.
 * @param {React.ReactElement} props.children The children to be rendered.
 * @param {string} props.className An optional className to be added to the component.
 * @return {React.ReactElement} The NavigationMenu component.
 */
export default function NavigationMenu({ className, menuLocation, children }) {
  const { useQuery } = client;
  const { nodes: menuItems } = useQuery().menuItems({
    where: {
      location: menuLocation,
    },
  });

  if (!menuLocation) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'The menuLocation prop is required on the <NavigationMenu /> component.'
      );
    }

    return null;
  }

  if (!menuItems) {
    return null;
  }

  return (
    <nav
      className={className}
      role="navigation"
      aria-label={`${menuItems[0]?.menu.node.name} menu`}
    >
      <ul className="menu">
        {menuItems.map((item, index) => {
          const { id, path, label } = item;
          const animationOrder = { "--animation-order": index };
          return (
            <li key={id ?? ''}>
              <Link href={path ?? ''} ><a style={animationOrder} className="uppercase text-[22px] font-extralight text-white font-degular">{label ?? ''}</a></Link>
            </li>
          );
        })}
        {children}
      </ul>
    </nav>
  );
}
