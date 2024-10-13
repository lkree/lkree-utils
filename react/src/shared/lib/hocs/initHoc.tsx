import type { ComponentPropsWithoutRef, ComponentType, FC } from 'react';

type ComponentProps<T extends ComponentType, AdditionalPropsToComponent, RequiredPropsToComponent> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof AdditionalPropsToComponent
> &
  RequiredPropsToComponent;

interface BaseComponent<T extends ComponentType> {
  baseComponent: T;
}

type PassVoidProps<T> = T extends void ? object : T;

type HOCWrapperProps<
  CompType extends ComponentType,
  HOCProps,
  AdditionalPropsToComponent,
  RequiredPropsToComponent
> = PassVoidProps<HOCProps> &
  ComponentProps<CompType, AdditionalPropsToComponent, RequiredPropsToComponent> &
  BaseComponent<CompType>;

export const initHoc =
  <HOCProps, AdditionalPropsToComponent = object, RequiredPropsToComponent = object>(
    HOCWrapper: FC<HOCWrapperProps<any, HOCProps, AdditionalPropsToComponent, RequiredPropsToComponent>>
  ) =>
  <T extends ComponentType<any>>(Component: T, HOCProps: HOCProps) =>
  (props: ComponentProps<T, AdditionalPropsToComponent, RequiredPropsToComponent>) =>
    <HOCWrapper {...props} {...(HOCProps as PassVoidProps<HOCProps>)} baseComponent={Component} />;
