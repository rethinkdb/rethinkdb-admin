import React, { Ref } from 'react';
import { NavLink as BaseNavLink, NavLinkProps } from 'react-router-dom';

export const NavLink = React.forwardRef(
  (
    props: NavLinkProps & React.RefAttributes<HTMLAnchorElement>,
    ref: Ref<HTMLAnchorElement>,
  ) => (
    <BaseNavLink
      ref={ref}
      {...props}
      className={({ isActive }) =>
        [props.className, isActive ? 'Mui-selected' : null]
          .filter(Boolean)
          .join(' ')
      }
    />
  ),
);
