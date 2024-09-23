---
sidebar_position: 8
---
# Command Help

A command help is an object that is responsible for showing all the help usages of a command you make, it's easy to customize how will your help-menu will be displayed.

The `CommandHelp` object is created automatically for you, to specify a command help object in classic, just call in the execution 
`context.getContextResolvedArgument(CommandHelp.class)` or in the annotations by adding a parameter with type `CommandHelp` and it will be context resolved automatically.

## Usage
we will create a `/group <group> help` by using the annotations and you must also include a parameter of type `CommandHelp`.
The class below is an example that we will be working on using annotations:

```java
@Command("group")  
public final class GroupCommand {  

	@Usage  
	public void defaultUsage(BukkitSource source) {  
		//default execution = no args  
		source.reply("/group <group>");  
	}	

	@Usage  
	public void mainUsage(
		BukkitSource source, 
		@Named("group") @SuggestionProvider("groups") Group group
	) {  
		//when source inputs "/group <group>"  
		source.reply("entered group name= " + group.name());  
	}

	@SubCommand("help") //help usage -> /group <group> help
	public void groupHelp(  
		BukkitSource source,  
		@Named("group") Group group,  
		CommandHelp help /*context resolved parameter*/ 
	) {  
		source.reply("Group entered= " + group.name());  
		//showing help to the user
		help.display();  
	}
}
```
### Help provider
A help provider is an interface whose only responsibility is to provide help-menu per command
and it needs `ExecutionContext` as a parameter to do so.
Help provider is cached in `Imperat`(the dispatcher) acting as a global help providing service.

You can implement your own help-provider and register it, to define how the help message is displayed as below:
```java
public final class ExampleHelpProvider implements HelpProvider<YourPlatformSource> {
    @Override
    public void provide(ExecutionContext<YourPlatformSource> context) throws ImperatException {
        var src = context.source();
        var cmd = context.command();
        
        if(cmd.usages().isEmpty()) {
            throw new NoHelpException();
        }
        
        src.reply("sending the help for command '" + cmd.name() + "'");
        for(var usage : cmd.usages()) {
            src.reply("[+] /" + CommandUsage.format(cmd, usage) + " - " + usage.description());
        }
    }
}

```

and then registering your help provider
```java
    imperat.setHelpProvider(new ExampleHelpProvider());
```

### Templates
Some people would prefer to have their help displayed in the old format
Any help template has 3 main components:
- **Two Hyphens** (header and footer)
- **UsageFormatter** -> defines the formatting of each single `CommandUsage` 

In imperat, there's an abstract class called `HelpTemplate`, it implements `HelpProvider` which contains these components,
and another abstract class called `PaginatedHelpTemplate` (the name describes it's purpose) which extends `HelpTemplate` adding 
the ability to display command usages in the form of pages.
Both classes are sealed, meaning that you can't extend them to make your own templates.
You are forced to use our built-in builders for creation of templates as below

```java
imperat.setHelpProvider(
    HelpProvider.<YourPlatformSource>template()
        .header(content -> "------- " + content.command().name() + "'s help --------")
        .footer(content -> "-----------------")
        .formatter(yourOwnFormatter)
        .displayer((context, usages)-> {
            //define how usages are displayed here
        })
        .build()
);
```

As you can see above, you can define header, footer, `UsageFormatter` and displayer consumer to override the default display algorithm.

:::note[Notice]
You are not required to create your displayer; By default, it's a simple for-loop showing the usages linearly
along with their description on the right.

:::

the header and footer are hyphens for help (`HelpHyphen`) which has some data/content cached with it (`HyphenContent`) which contains:
- Command owning the usages
- current page and max-pages (they are `1` by default if the template isn't paginated)

Here's a quick example below on creating and registering a paginated template
```java
imperat.setHelpProvider(
    HelpProvider.<YourPlatformSource>paginated(10)
            .header(
                content -> "--------" + content.command().name() + "'s help (" 
                    + content.currentPage() + "/" + content.maxPages() + ") ------"
            )
            .footer((content) -> "------------")
            .build()
);
```

You can use the default `UsageFormatter`, but it's okay to make your own 
`UsageFormatter` instead of the default built-in formatter`, here's an example of
implementing your own `UsageFormatter`:-

```java
public class ExampleUsageFormatter implements UsageFormatter {

    
    @Override
    public <S extends Source> String formatUsageLine(Command<S> command, CommandUsage<S> usage, int index) {
        String format = "/" + CommandUsage.format(command, usage);
        return  format + " - " + usage.description();
    }
    
}
```

:::info[Notice]
paginated help templates forces you to specify the number of usages to be displayed per one page.
which is `10` usages per page as specified in the example above.
Moreover, the paginated template builder has the same methods as that of the normal template builder.
:::

:::tip[Tip]
If no usage description is supplied during command creation it will return `N/A` by default.
The `N/A` represents an unknown description, if it is annoying you, you can set a description per subcommand/usage whether using the classic way or the annotations.

:::
