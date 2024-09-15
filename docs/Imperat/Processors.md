---
sidebar_position: 9
---
# Processors

:::caution[WARNING]
We have already talked about the life cycle of `Context` object during the command's execution
If you haven't read that yet, please try reading about the [Context-LifeCycle](Dispatcher%20API#Life%20Cycle%20of%20Context).
as the explanation below will be fully based on this.

:::



**Frequently asked question:** What are Processors in Imperat ? 
**Answer:-**
They are interfaces that define processes to happen right before the command execution.
These processes can be validations such as permission checking or cooldown checks.

Processors are classified into :
- **Global processors**
- **Command processors**

**Global** means that they for every command in general, while `Command processors` means that the processors are processing for specific command only.

There are 2 types of processors (whether global or not) :
- **Pre-processors**
- **Post-processors**

## Preprocessors
The prefix in their name `Pre` means `Before` which indicates the fact that the process happens **BEFORE** context resolving.
and that's why it has just `Context` inside of it's method.

## Postprocessors
The prefix in their name `Post` means `AFTER` which indicates the fact that the process happens **AFTER** context resolving
therefore, it has `ResolvedContext` instead of just `Context` inside of it's method.



:::tip[Pro%20Tip]
You can create a validation check , and when it fails you can stop the runtime of the command execution 
by throwing a exception.
for more details on exceptions, check [Throwables](Throwables.md)

:::

## Registering processors
All registrations are within the `Imperat` api/dispatcher object. 

### Registering Global processors
you can register processors globally by calling `imperat#registerGlobalPreProcessor` for registering pre processors and/or 
`imperat#registerGlobalPostProcessor` for registering post processors.

### Registering Command processors
We have already discussed that in [Classic Command API](command-api/Classic%20Command%20API.md) and for annotations in [Annotations Command API](command-api/Annotations%20Command%20API.md).