# Schemas in TypeScript

Mongoose [schemas](/docs/guide.html) are how you tell Mongoose what your documents look like.
Mongoose schemas are separate from TypeScript interfaces, so you need to define both a _document interface_ and a _schema_.

```typescript
import { Schema } from 'mongoose';

// Document interface
interface User {
  name: string;
  email: string;
  avatar?: string;
}

// Schema
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});
```

By default, Mongoose does **not** check if your document interface lines up with your schema.
For example, the above code won't throw an error if `email` is optional in the document interface, but `required` in `schema`.

## Generic parameters

The Mongoose `Schema` class in TypeScript has 3 [generic parameters](https://www.typescriptlang.org/docs/handbook/2/generics.html):

- `DocType` - An interface descibing how the data is saved in MongoDB
- `M` - The Mongoose model type. Can be omitted if there are no query helpers or instance methods to be defined.
  - default: `Model<DocType, any, any>`
- `TInstanceMethods` - An interface containing the methods for the schema.
  - default: `{}`

<details>
  <summary>View TypeScript definition</summary>
    
  ```typescript
  class Schema<DocType = any, M = Model<DocType, any, any>, TInstanceMethods = {}> extends events.EventEmitter {
    // ...
  }
  ```
  
</details>

### Mongoose's usage of the generic parameters
The first generic param, `DocType`, represents the type that Mongoose uses as `this` for document middleware.
For example:

```typescript
schema.pre('save', function(): void {
  console.log(this.name); // TypeScript knows that `this` is a `User` by default
});
```

The second generic param, `M`, is the model used with the schema. Mongoose uses the `M` type in model middleware defined in the schema.

The third generic param, `TInstanceMethods` is used to add types for instace methods defined in the schema.

## Schema vs Interface fields

Mongoose checks to make sure that every path in your schema is defined in your document interface.

For example, the below code will fail to compile because `emaill` is a path in the schema, but not in the `DocType` interface.

```typescript
import { Schema, Model } from 'mongoose';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

// Object literal may only specify known properties, but 'emaill' does not exist in type ...
// Did you mean to write 'email'?
const schema = new Schema<User>({
  name: { type: String, required: true },
  emaill: { type: String, required: true },
  avatar: String
});
```

However, Mongoose does **not ** check for paths that exist in the document interface, but not in the schema.
For example, the below code compiles.

```typescript
import { Schema, Model } from 'mongoose';

interface User {
  name: string;
  email: string;
  avatar?: string;
  createdAt: number;
}

const schema = new Schema<User, Model<User>, User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});
```

This is because Mongoose has numerous features that add paths to your schema that should be included in the `DocType` interface without you explicitly putting these paths in the `Schema()` constructor. For example, [timestamps](https://masteringjs.io/tutorials/mongoose/timestamps) and [plugins](/docs/plugins.html).
