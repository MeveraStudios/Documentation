---
sidebar_position: 2
---

:::warning
If any term isn't familiar to you in this section, please check out [Introduction](../)
:::

Commands can be also created/declared using [Java annotations](https://www.javatpoint.com/java-annotation) using the built-in annotations that Imperat will be providing you, these annotations are classified by their level into 4 categories :-

- Class-level annotations *(used only on top of classes)*
- Method-level annotations *(used only on top of methods)*
- Parameter-level annotations *(used only on method-parameters)*
- Wildcard annotations *(used in all 3 other levels)*

:::tip
An '**element**' here refers to a part of the command that is annotated.
can be a class, a method, or even a parameter.

:::

## Class-level annotations:

- `@Command` Declares a root command, and it has 2 main components:
    - `String[] values` -> an array of names for the command, the first element is treated as the unique name for this command, while the rest (if present) is treated as aliases
    - `boolean ignoreAutoCompletionPermission` -> if false (by default), it will always check if the player auto-completing any of the usages of this command , has the permission for this command or not, if he doesn't have the permission, it will not auto-complete for him.

- `@SubCommand` Declares a subcommand-class 
    - same as `@Command` but with extra option `boolean attachDirectly` which decides whether this sub command will be attached directly to the parent-command or not.

- `@Inherit` Declares that the current command class , inherits a subcommand class as it's child,
it's made for developers who would prefer their subcommands to be separated into different classes.

:::info[Advanced Detail]
Inner classes are also parsed by default as commands and/or subcommands
without the need for @Inherit.

:::


## Method-level annotations

We currently have six built-in annotations that are meant to be used on methods only, which are:
- `@Command` -> declares a standalone command separately from the root command (as the root command doesn't have to be present)

- `@PreProcessor` -> declares a pre-processor to be added to the command
- `@PostProcessor` -> declares a post-processor to be added to the command
- `@Usage` -> Declares a command usage
- `@SubCommand` -> Declares a subcommand usage method
- `@Cooldown` -> Declares a cooldown for this usage
- `@Async` -> Declares that the usage will be executed asynchronously

:::info[Info]
Every usage method should include `YourPlatformSource` as their first parameter.
It refers to the command-sender/source that is executing the command.

:::

:::tip[Tip]
A help-usage method MUST have one parameter of type `CommandHelp`.

:::

## Parameter-level annotations
We currently have 10 built-in annotations that are designed to be used only on parameters :-
- `@Named`
- `@Optional`
- `@Default`
- `@DefaultProvider`
- `@Greedy`
- `@Suggest`
- `@SuggestionProvider`
- `@Range`
- `@Flag`
- `@Switch`

:::note
Every parameter-level annotation is NOT required.

:::

### @Named
Since the compile-time parameter names are changed to something like `arg0`, using this annotation you can specify a name for the parameter.

### @Optional
All parameters are `required` by default, adding `@Optional` to the parameter , will declare that 
this parameter is an optional parameter.

### @DefaultValue and @DefaultValueProvider
All parameters naturally have no `default-value` to fall back on when they could not be
resolved due to being optional and the user not entering it's value. so instead of being `null`
you could specify a default value for it using the annotations `@DefaultValue` or `@DefaultValueProvider`.

If you use `@DefaultValue` you will need to specify a string as a default value, so by natural corresponding logic, the parameter's type should also be `String`.However what if the parameter's type is not `String`, here it comes the advantage of `DefaultValueProvider`.

#### Using @DefaultValueProvider
First you should create a class that implement `OptionalValueSupplier<YourType>` where `YourType` here refers to the type of the parameter's value.
here's a quick example below for the type `Boolean` :
```java
public final class BooleanValueSupplier implements OptionalValueSupplier<Boolean>{ 

    @Override  
    public Class<Boolean> getValueType() {  
        return Boolean.class;  
    }  
    
  @Override  
    public <C> Boolean supply(Context<C> context) {  
        return false;  
    }  
}
```

Another example of how the annotation would look like on the parameter:
```java
@Default(BooleanValueSupplier.class) boolean parameter
```

:::tip[Pro Tip]
You can use @Default or @DefaultProvider if you want to specify an optional argument with a default value
you can add one of those `@Default` & `@DefaultProvider` without explicitly adding `@Optional`
If you want an optional argument with null as it's default value, then use `@Optional` only

:::

:::danger[CRITICAL]
Make sure that any sub-class of `OptionalValueSupplier` have an empty public constructor

:::

### @Greedy
It declares the parameter as a string that consumes all raw-arguments starting from the raw-argument that corresponds to the parameter's position till the last of the raw-arguments.

:::danger [CRITICAL]
DONT USE THIS PARAMETER IN THE MIDDLE, SHOULD BE USED ONLY AS THE LAST PARAMETER.
A USAGE SHOULD NOT HAVE MORE THAN ONE `GREEDY` PARAMETER

:::

### @Suggest and @SuggestionProvider
As we learned in [Suggestion Resolver](../Suggestion%20Resolver.md#annotations-example) , both annotations can be used to declare suggestions
per parameter.

Frequently asked question: What's the key difference between using `@Suggest` and `@SuggestionProvider` ?

Answer: `@Suggest` is for plain static tab-completion results that are not changed based on context or the command-sender, while `@SuggestionProvder` is for dynamic providing of tab-completion results that require context or can be changed based on context.

`@SuggestionProvider` also takes a `String` which indicates the unique NAME of a `SuggestionResolver` registered in the `Imperat` using `Imperat#registerNamedSuggestionResolver`.

### @Range
Specifies a range for a numeric parameter , has a `min` and a `max` field.
If the number entered by the command source/sender is below the min or exceeds the max, 
then a built-in `NumberOutOfRangeException` exception is thrown , stopping the command execution and sending the error message to the command-source.

### @Flag & @Switch
A true flag comes with an input next to it, example: `-yourFlag <value-input>` , while the switch is a flag that gives a `boolean` value determined by it's presence in the context `-silent`.

## Wildcard annotations
They are annotations that can be used on all levels (classes, methods and parameters).
There is currently two built-in annotations of that type which are :-
- `@Permission` -> specifies the permission of a command/usage/parameter(for tab-completion).
- `@Description` -> specifies the description of a command/usage/parameter(for tab-completion).
## Example
Here's an example of a command that uses some of the features mentioned above.
```java
@Command("ban")  
@Permission("command.ban")  
@Description("Main command for banning players")  
public final class BanCommand {

    @Usage  
    public void showUsage(BukkitSource source) {
        source.reply("/ban <player> [-silent] [duration] [reason...]");  
    }

    @Usage  
    public void banPlayer(  
            BukkitSource source,  
            @Named("player") OfflinePlayer player,  
            @Switch({"silent", "s"}) boolean silent,  
            @Named("duration") @Optional @Nullable String duration,  
            @Named("reason") @DefaultValue("Breaking server laws") @Greedy String reason
    ) {
        //TODO actual ban logic  
        String durationFormat = duration == null ? "FOREVER" : "for " + duration;  
        String msg = "Banning " + player.getName() + " " 
        + durationFormat + " due to " + reason;  
        
        if (!silent)  
            Bukkit.broadcastMessage(msg);  
        else  
            source.reply(msg);  
    }  
}
```

## Custom Annotations
You can also make your own annotations and define how they are being useful to the parsing process of a command class. This is possible thanks to our `AnnotationReplacer` interface, which is an interface that allow you to create multiple built-in annotations that would act as a replacement for your custom annotation during the parsing process.

Let's start first with creating our custom annotation:
```java
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.TYPE)  
public @interface MyCommand {  }
```

Then we will be registering our `AnnotationReplacer` for annotation type of `MyCommand` as below:

```java
imperat = BukkitImperat.builder(plugin)
    .annotationReplacer(
        MyCommand.class, 
        (annotation)-> {  
            var cmd = AnnotationFactory.create(  
                    Command.class,  
                    "value" , new String[]{"name", "alias"});  
            var permission = AnnotationFactory.create(Permission.class, "value", "command.group");  
            var desc = AnnotationFactory.create(Description.class, "value",  
                    "Main command for managing groups/ranks");  
            return List.of(cmd, permission, desc);  
        }
    )
.build();
```

:::danger[CRITICAL]
Make sure you have the correct imports for the built-in annotations

:::

As shown above, when you use the annotation `MyCommand` on the top of the class, the parser will look for any registered annotation replacers for this type, when it finds your annotation replacer that you (should have) registered, It will use it to create annotations dynamically , so that it would be equivalent to putting all of these annotations on the top of the class.

### Creating annotations dynamically
Imperat provides you with a utility class for creating annotation instances dynamically 
through the class `AnnotationFactory#create`.

every annotation has it's methods that define attributes for the annotation, they are entered in the `AnnotationFactory#create` method in the form of `methodName, methodValue` as seen above.
In case of the `@Permission` annotation, I have entered `value` method then it's return value directly after it which is basically the permission string in this case.

:::tip[Pro tip]
If your custom annotation has attributes/methods, you can easily call these methods inside 
of the `AnnotationReplacer` lambda using the provided parameter.

:::
