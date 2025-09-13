---
sidebar_position: 6
---
# Command Help

:::warning
The Help API is **EXPERIMENTAL**, meaning that its not fully stable yet and may undergo breaking changes in the future.
:::

The new Help API makes it super easy to show help for your commands. It’s built from just a few simple building blocks:

## The 3 Main Parts

1. **HelpQuery** – What the user is asking for (like “show me help for this command”).
2. **HelpEntry** – Each piece of help info (like a command, subcommand, or usage).
3. **HelpRenderer** – How the help is shown (as a list, a tree, etc.).

When a user asks for help, here’s what happens:
- You make a `HelpQuery` (you can filter what the user is allowed to see).
- The system finds matching `HelpEntry` items.
- The entries are shown using a `HelpRenderer` (with your chosen layout and theme).

There are two layouts you can use out of the box:
- **List** – Shows commands in a simple list.
- **Tree** – Shows commands in a tree with branches.

All of this is managed by the `CommandHelp<YourSource>` object, which you get automatically in your command method.

---

### The Easiest Example

Here’s how you use the new Help API in your command:

```java
@Command("example")
public final class ExampleCommand {

    @Usage
    public void defaultUsage(YourSource source, @ContextResolved CommandHelp<YourSource> commandHelp) {
        // Show help when user runs '/example'
        commandHelp.display(
            HelpQuery.<YourSource>builder()
                .filter(HelpFilters.hasPermission(source, commandHelp)) // Only show what the user can use
                .build(),

            new ExampleHelpTheme()  
        );
    }
}
```

Then you need to create and implement your `HelpTheme` by extending `BaseHelpTheme`.
A help theme is based on the type of content (Plain text/string OR [Kyori Adventure's components](https://docs.advntr.dev/))  AND the type of the source that will receive this 
help view.

But first we need to define how can we create these help components AND how these components will be displayed to the user, so let's create a class that does that :
```java
final class HelpComponentCreator {
    
    private HelpComponentCreator() {
        throw new UnsupportedOperationException("This class cannot be instantiated");
    }
    
    static HelpComponent<VelocitySource, Component> createHelpComponent(Component component) {
        return new AdventureHelpComponent<>(component, (src, compToSend)-> src.reply(compToSend));
    }
}
```

Here's a quick example on velocity.
```java
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.event.HoverEvent;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.ShadowColor;
import net.kyori.adventure.text.format.TextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.jetbrains.annotations.NotNull;
import studio.mevera.imperat.VelocitySource;
import studio.mevera.imperat.command.Command;
import studio.mevera.imperat.command.CommandUsage;
import studio.mevera.imperat.command.parameters.CommandParameter;
import studio.mevera.imperat.command.tree.help.renderers.UsageFormatter;
import studio.mevera.imperat.command.tree.help.theme.BaseHelpTheme;
import studio.mevera.imperat.command.tree.help.theme.HelpComponent;
import studio.mevera.imperat.command.tree.help.theme.HelpTheme;
import studio.mevera.imperat.context.ExecutionContext;

public class ExampleHelpTheme extends BaseHelpTheme<VelocitySource, Component> {
    
    private final UsageFormatter<VelocitySource, Component> usageFormatter = new ExampleUsageFormatter();
    
    public ExampleHelpTheme() {
        super(
            PresentationStyle.FLAT,
            1,
            HelpComponentCreator::createHelpComponent
        );
    }
    
    @Override
    public @NotNull Component createEmptyContent() {
        return Component.empty();
    }
    
    @Override
    public @NotNull Component getBranchContent() {
        return Component.text("├─ ");
    }
    
    @Override
    public @NotNull Component getLastBranchContent() {
        return Component.text("└─ ");
    }
    
    @Override
    public @NotNull Component getIndentContent() {
        return Component.text("│  ");
    }
    
    @Override
    public @NotNull Component getEmptyIndentContent() {
        return Component.text("   ");
    }
    
    @Override
    public @NotNull Component getHeaderContent(ExecutionContext<VelocitySource> context) {
        // Create separate hyphen components (don't reuse the same instance)
        Component leftHyphen = Component.text("==========")
                .decorate(TextDecoration.STRIKETHROUGH, TextDecoration.BOLD)
                .color(TextColor.fromHexString("#282863"));
        
        Component rightHyphen = Component.text("==========")
                .decorate(TextDecoration.STRIKETHROUGH, TextDecoration.BOLD)
                .color(TextColor.fromHexString("#282863"));
        
        // Create the middle text component with its own style (no inheritance)
        Component middleText = Component.text(" Commands View ")
                .color(TextColor.fromHexString("#ffd700"))
                .decorate(TextDecoration.BOLD)
                .decoration(TextDecoration.STRIKETHROUGH, false);
        
        // Create the legend component with its own style
        Component legend = Component.text("Required:", NamedTextColor.GRAY)
                .decoration(TextDecoration.STRIKETHROUGH, false)
                .decoration(TextDecoration.BOLD, false)
                .append(Component.space())
                .append(Component.text("<>", TextColor.fromHexString("#90d17d")))
                .append(Component.space())
                .append(Component.text("Optional:", NamedTextColor.GRAY))
                .append(Component.space())
                .append(Component.text("[]", TextColor.fromHexString("#deb76a")));
        
        // Combine everything
        return leftHyphen
                .append(middleText)
                .append(rightHyphen)
                .appendNewline()
                .append(legend)
                .appendNewline();
    }
    
    @Override
    public @NotNull Component getFooterContent(ExecutionContext<VelocitySource> context) {
        return Component.text("==============================")
                .decorate(TextDecoration.STRIKETHROUGH, TextDecoration.BOLD)
                .color(TextColor.fromHexString("#282863"));
    }
    
    @Override
    public @NotNull UsageFormatter<VelocitySource, Component> getUsageFormatter() {
        return usageFormatter;
    }
    public static class ExampleUsageFormatter implements UsageFormatter<VelocitySource, Component> {
        
        @Override
        public @NotNull HelpComponent<VelocitySource, Component> format(
                Command<VelocitySource> lastOwningCommand,
                CommandUsage<VelocitySource> pathway,
                ExecutionContext<VelocitySource> context,
                HelpTheme<VelocitySource, Component> theme
        ) {
            String cmdPrefix = context.imperatConfig().commandPrefix();
            Component usageComponent = Component.text(cmdPrefix + context.command().format(), TextColor.fromHexString("#1f3b29"));
            for(CommandParameter<VelocitySource> parameter : pathway.getParameters()) {
                usageComponent = usageComponent
                        .appendSpace()
                        .append(formatParameter(context, parameter));
            }
            
            return HelpComponentCreator.createHelpComponent(usageComponent);
        }
        
        private Component formatParameter(ExecutionContext<VelocitySource> context, CommandParameter<VelocitySource> parameter) {
            var comp = Component.text(parameter.format());
            boolean hasParameterPermission = context.imperatConfig().getPermissionChecker().hasPermission(context.source(), parameter);
            if(!hasParameterPermission) {
                comp = comp.colorIfAbsent(NamedTextColor.RED);
                return comp;
            }
            
            if(parameter.isCommand()) {
                comp = comp.colorIfAbsent(TextColor.fromHexString("#459fa1"));
                comp = comp.shadowColor(ShadowColor.fromHexString("#210a5700"));
            }else if(parameter.isOptional()) {
                comp = comp.colorIfAbsent(TextColor.fromHexString("#deb76a"));
            }else {
                comp = comp.colorIfAbsent(TextColor.fromHexString("#90d17d"));
            }
            
            if(!parameter.description().isEmpty()) {
                comp = comp.hoverEvent(
                        HoverEvent.showText(
                                Component.text(parameter.description().toString())
                                        .colorIfAbsent(NamedTextColor.GRAY)
                        )
                );
            }
            
            return comp;
        }
    }
    
}

```

**That’s it!**  
You don’t need to set up anything else for basic help.


:::tip
You can easily customize what usages appear on the help by adding your own filters, by 
implementing your own `HelpFilter<S>` where `S` is the type of the source of your platform.
:::
---

## TL;DR

- **HelpQuery** = what help to show
- **HelpEntry** = each help item
- **HelpRenderer** = how it looks
- Use `CommandHelp.display()` in your command to show help
