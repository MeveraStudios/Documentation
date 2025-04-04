---
sidebar_position: 7
---
# Suggestion Resolver

Imperat has it's own `AutoCompleter` algorithm that works pretty good.
Each command created, has with it an instance of `AutoCompleter` which basically auto-completes
the arguments during tab-completion for suggestions for each argument.

If you ever wanted to add suggestions/completions to specific arguments, then you would need
what we call a `SuggestionResolver` which is an interface that simply provide a list of `String` indicating the autocompleted results per argument.

### Creating your suggestion-resolver
There's only one parental interface which is`SuggestionResolver`, that is classified according to the functionality, into:
- **Per parameter**
- **Per type**

You should create a new class and implement `YourPlatformSuggestionResolver` , as shown below using the custom class `Group` in **Bukkit** platform:

```java
public final class GroupSuggestionResolver implements SuggestionResolver<BukkitSource, Group> {

    @Override
    public List<String> autoComplete(SuggestionContext<BukkitSource> context, CommandParameter parameter) {
        return GroupRegistry.getInstance().getAll()
                .stream().map(Group::name)
                .collect(Collectors.toList());
    }
    
}
```


## Registering your suggestion-resolver
There are only 2 ways to register and make use of a suggestion resolver:
- Per parameter
- Per type
### Per parameter
There are extra static methods for the creation of all types of parameters inside of the interface `CommandParameter` to create the parameters through the **Classical** way.
These extra methods have one extra parameter for an instance of `SuggestionResolver`
allowing you to register suggestions per parameter you make.

It can also be done through annoations.
##### Annotations example
There are 2 annotations for providing a suggestion :
- `@Suggest` -> provides plain suggestions (not dynamic)
- `@SuggestionProvider` -> dynamic providing of auto-completions

When using `@SuggestionProvider`, it has a required field of type `String` which 
indicate the unique name of a `SuggestionResolver` that can be registered through 
`Imperat#registerNamedSuggestionResolver(name, suggestionResolver)`
###### Quick-example:

```java
@Usage  
public void mainUsage(
  BukkitSource source,
  @Named("group") @SuggestionProvider("groups") Group group
){  
	//when he does "/group <group>"  
	source.reply("entered group name= " + group.name());  
}
```

Registering your suggestion resolver with it's unique name :-

```java
imperat = BukkitImperat.builder(plugin)
    .namedSuggestionResolver("groups", new GroupSuggestionResolver())
    .build();
```
Check [Annotations Command API](command-api/Annotations%20Command%20API.md) section for more details.

### Per type
Moreover, you can also register suggestions per type of parameter 
through registering a `ParameterType` for the required type.
Navigate to [Parameter Types](Parameter-Type.md) for more details.

## Summary
so when the user tab-completes an argument, the auto-completer checks first if the parameter has a personal **(a.k.a Per parameter)** `SuggestionResolver`, if so it uses it for it's suggestions, otherwise it will fall back to the general one **(a.k.a Per type)**.
