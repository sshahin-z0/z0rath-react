# `z0rath-react` - Centralized Authorization System

`z0rath-react` provides a set of components and hooks for managing user roles and permissions in Z0rath (a centralized authorization system). It allows you to easily manage access to different parts of your application based on permissions defined by your organization.

## Installation

To get started with `z0rath-react`, install the package using npm or yarn:

```bash
npm install z0rath-react
```
For yarn
```bash
yarn add z0rath-react
```

## Usage
### Basic Setup

In order to use the z0rath-react library, you need to wrap your app in a Z0rathProvider and provide your organization's API key for authorization. Once the provider is set up, you can use the hooks and components provided by the library to manage and control user access.

### Example Usage

Here’s an example of how to use z0rath-react to manage user roles and permissions:

```typescript jsx
import React, { useState } from "react";
import { Z0rathProvider, useZ0rath, HasPermission } from "z0rath-react";

// A component to allow switching between users based on email input
const Switcher = () => {
    const { setUser } = useZ0rath();
    const [userEmail, setUserEmail] = useState(""); // State for storing the user email
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <input
                type="text"
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                placeholder="Enter User Email"
                style={{ padding: "8px", fontSize: "16px" }}
            />
            <button
                onClick={() => {
                    setUser(userEmail); // Switch user based on email
                }}
                style={{
                    padding: "8px 12px",
                    marginLeft: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Change User
            </button>
        </div>
    );
};

const ProtectedComponent = () => {
    return (
        <HasPermission slug="READ">
            <div>Protected Content: You have access!</div>
        </HasPermission>     
    );
};

function App() {
    return (
        <Z0rathProvider apiKey="your-organization-api-key">
            {/* Your app components */}
            {/* User switching interface */}
            <Switcher />
            <ProtectedComponent />
        </Z0rathProvider>
    );
}
```
## Components:
- `Z0rathProvider` is a context provider that makes Z0rath available throughout your app. It requires the apiKey prop to authenticate with the backend service.
```typescript jsx
<Z0rathProvider apiKey="your-organization-api-key">
  {/* Your app components */}
</Z0rathProvider>
```
- `useZ0rath` hook provides access to the current user's data and allows you to perform actions like setting the active user.
```typescript jsx
const { setUser } = useZ0rath();
setUser("user@example.com");
```
- `HasPermission` component allows you to conditionally render content based on whether the user has the required permission. It takes the slug prop, which represents the permission you want to check.
```typescript jsx
<HasPermission slug="READ">
  <div>This content is only visible to users with READ permission</div>
</HasPermission>
```


## Advanced Usage - Managing Multiple Permissions

You can manage multiple permissions within your app by nesting HasPermission components or combining them with other UI elements:

```typescript jsx
<HasPermission slug="READ">
  <HasPermission slug="WRITE">
    <div>Only users with both READ and WRITE permissions can see this content.</div>
  </HasPermission>
</HasPermission>
```

----------------

# Contributing

We welcome contributions to the z0rath-react library! If you find any bugs or want to suggest a feature, please open an issue or create a pull request.