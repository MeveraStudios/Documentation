---
title: Imperat Complete Feature List
sidebar_position: 21
---

# Imperat Command Framework - Complete Feature List

## **Core Command System**

### **Annotation-Based Command Creation** 
Create commands using simple annotations like `@Command`, `@Usage`, and `@SubCommand`. This declarative approach makes command creation intuitive and readable, allowing you to focus on business logic rather than boilerplate code.

### **Classic Command Builder Pattern**
Build commands programmatically using fluent builders for maximum flexibility. Perfect for dynamic command generation, complex conditional logic, or when you need complete control over the command structure.

### **Multi-Platform Support**
Works across Bukkit/Spigot/Paper, BungeeCord, Velocity, Minestom, CLI applications, and more. Each platform gets its own specialized implementation while maintaining consistent API usage across all environments.

## **Advanced Command Structure**

### **Hierarchical Subcommands**
Create complex command trees with unlimited nesting using `@SubCommand` annotations or builder methods. Supports three attachment modes (MAIN, DEFAULT, EMPTY) to control how subcommands relate to parent parameters.

### **Multiple Usage Patterns**
Define multiple ways to use the same command with different parameter combinations. Imperat automatically determines the best match based on user input, supporting EMPTY, DEFAULT, and MAIN usage types.

### **External Subcommand Inheritance**
Use `@ExternalSubCommand` to include separate command classes as subcommands. Supports recursive inheritance for building deep, reusable command hierarchies across multiple files.

## **Parameter System**

### **Rich Parameter Types**
Built-in support for primitives, collections, maps, arrays, enums, UUIDs, and platform-specific types like Player, World, Location. Automatically handles type conversion with comprehensive error messages.

### **Custom Parameter Types**
Create your own parameter types by extending `BaseParameterType` to handle domain-specific objects. Includes support for complex resolution, input validation, suggestions, and default values.

### **Optional and Default Parameters**
Use `@Optional`, `@Default`, and `@DefaultProvider` annotations to create flexible command signatures. Supports static defaults or dynamic value suppliers for context-aware defaults.

### **Parameter Validation**
Built-in validation with `@Range` for numeric values, `@Values` for restricted choices, and custom validation through parameter types. Provides clear error messages when validation fails.

### **Greedy Parameters**
Use `@Greedy` to consume all remaining input arguments into a single parameter. Perfect for messages, descriptions, or any multi-word input that should be treated as one value.

### **Flag and Switch Support**
Implement command flags with `@Flag` (requires values) and `@Switch` (boolean toggles). Supports both long (`--flag`) and short (`-f`) formats with intelligent parsing and validation.

## **Tab Completion & Suggestions**

### **Static Suggestions**
Provide fixed suggestion lists using `@Suggest` annotation for predictable options like game modes, difficulty levels, or command flags.

### **Dynamic Suggestion Resolvers**
Create context-aware suggestions that change based on current game state, player permissions, or command context. Register named resolvers for reuse across multiple commands.

### **Smart Suggestion Filtering**
Imperat automatically filters suggestions based on user input and handles case-insensitive matching. Control suggestion overlap for optional parameters and provide consistent user experience.

## **Permission & Security**

### **Granular Permission System**
Apply permissions at command, subcommand, usage, and even parameter levels using `@Permission` annotations. Supports hierarchical permission structures for fine-grained access control.

### **Auto Permission Assignment (APA)**
Automatically generate permission nodes for entire command trees based on customizable patterns. Eliminates manual permission setup while maintaining consistent security across your application.

### **Source Validation**
Restrict commands to specific source types (players only, console only, etc.) with automatic validation and clear error messages when restrictions are violated.

## **Error Handling**

### **Self-Handled Exceptions**
Create custom exceptions that extend `SelfHandledException` and define their own error handling logic. Perfect for domain-specific errors with custom messaging and recovery strategies.

### **Centralized Exception Resolvers**
Register `ThrowableResolver` instances to handle specific exception types consistently across your entire command system. Provides clean separation between error detection and error presentation.

### **Built-in Exception Types**
Comprehensive set of built-in exceptions for common scenarios: permission denied, invalid syntax, cooldowns, validation failures, and more. Each provides rich contextual information for better error messages.

## **Processing Pipeline**

### **Pre-Processors**
Execute custom logic before command execution using `@PreProcessor` annotations or global processors. Perfect for validation, logging, permission checks, or modifying command context.

### **Post-Processors**
Run cleanup or logging tasks after command execution with `@PostProcessor` annotations. Access resolved parameters and execution results for comprehensive audit trails or side effects.

### **Processing Chains**
Build complex processing pipelines with ordered execution and error handling. Supports both global processors affecting all commands and command-specific processors.

## **Advanced Features**

### **Context Resolvers**
Automatically inject objects derived from command context using `@ContextResolved` annotation. Perfect for user data, game state, or any context-dependent values that don't come directly from user input.

### **Dependency Injection**
Inject services and managers into command classes using `@Dependency` annotation. Supports both field injection and constructor injection for clean separation of concerns.

### **Return Value Handling**
Process non-void return values from command methods using `ReturnResolver` implementations. Standardize output formatting and handle complex data objects consistently.

### **Custom Annotations**
Create your own annotations that generate multiple built-in annotations automatically. Reduce boilerplate and create domain-specific command patterns with `AnnotationReplacer`.

### **Source Resolution**
Convert platform-specific command sources to your own custom types using `SourceResolver`. Perfect for wrapping platform sources with your own enhanced functionality.

## **Help System**

### **Automatic Help Generation**
Generate comprehensive help messages automatically from command structure, descriptions, and parameter information. Supports context-aware help that shows only accessible commands.

### **Custom Help Providers**
Implement `HelpProvider` interface to create custom help formatting, pagination, or conditional help content. Supports both global and per-command help customization.

### **Paginated Help Templates**
Built-in support for paginated help with customizable headers, footers, and usage formatting. Handles large command sets gracefully with page navigation.

## **Configuration & Customization**

### **Flexible Configuration**
Extensive builder pattern for customizing every aspect of Imperat behavior. Configure permission checking, suggestion handling, error messages, processing chains, and much more.

### **Usage Verification**
Customizable usage verification to prevent ambiguous commands and ensure consistent command patterns. Supports type-tolerant verification and custom validation rules.

### **Placeholder System**
Dynamic content replacement in command attributes using registered placeholders. Perfect for configuration-driven command descriptions, permissions, or other string-based attributes.

### **Global Usage Defaults**
Set default properties (permissions, cooldowns, descriptions) that apply to all commands unless explicitly overridden. Ensures consistency across your entire command system.

## **Asynchronous Support**

### **Async Command Execution**
Mark commands or usages as asynchronous using `@Async` annotation. Perfect for database operations, file I/O, or any blocking operations that shouldn't freeze the main thread.

### **CompletableFuture Parameters**
Support for `CompletableFuture<T>` parameter types enabling non-blocking parameter resolution. Allows complex async operations while maintaining clean command signatures.

## **Performance & Optimization**

### **Command Cooldowns**
Built-in cooldown system using `@Cooldown` annotation with configurable time units and bypass permissions. Prevents command spam and manages resource-intensive operations.

### **Efficient Command Trees**
N-ary tree structure for fast command lookup and execution. Optimized parsing and matching algorithms handle complex command hierarchies efficiently.

### **Parameter Name Preservation**
Optional Java compiler flag preservation for cleaner parameter names without requiring `@Named` annotations. Improves developer experience while maintaining functionality.

---

Imperat provides a comprehensive command framework that scales from simple single commands to complex hierarchical systems while maintaining clean, readable code and excellent performance across multiple platforms.
