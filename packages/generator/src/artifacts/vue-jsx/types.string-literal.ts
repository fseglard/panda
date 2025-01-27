import { outdent } from 'outdent'
import type { Context } from '../../engines'

export function generateVueJsxStringLiteralTypes(ctx: Context) {
  const { factoryName, styleProps, componentName, upperName, typeName } = ctx.jsx

  return {
    jsxFactory: outdent`
${ctx.file.importType(upperName, '../types/jsx')}

export declare const ${factoryName}: ${upperName}
    `,
    jsxType: outdent`
import type { Component, FunctionalComponent, NativeElements } from 'vue'

type IntrinsicElement = keyof NativeElements
type ElementType = IntrinsicElement | Component

type ComponentProps<T extends ElementType> = T extends IntrinsicElement
  ? NativeElements[T]
  : T extends Component<infer Props>
  ? Props
  : never

type ${componentName}<T extends ElementType> = FunctionalComponent<ComponentProps<T>>
>

interface JsxFactory {
  <T extends ElementType>(component: T): ${componentName}<T>
}

type JsxElements = { [K in IntrinsicElement]: ${componentName}<K> }

export type ${upperName} = JsxFactory ${styleProps === 'none' ? '' : '& JsxElements'}

export type ${typeName}<T extends ElementType> = ComponentProps<T>
  `,
  }
}
